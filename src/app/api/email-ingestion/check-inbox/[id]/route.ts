import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as Imap from 'imap';
// import { simpleParser } from 'mailparser';

import {simpleParser} from 'mailparser';

import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function checkImapInbox(config: any) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: config.username,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.useSSL,
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) reject(err);

        // Search for unread messages with attachments
        imap.search(['UNSEEN', ['HEADER', 'content-type', 'application/pdf']], (err, results) => {
          if (err) reject(err);

          if (!results || !results.length) {
            imap.end();
            resolve([]);
            return;
          }

          const f = imap.fetch(results, {
            bodies: '',
            markSeen: true,
          });

          f.on('message', (msg, seqno) => {
            msg.on('body', async (stream, info) => {
              const parsed = await simpleParser(stream);
              
              if (parsed.attachments) {
                for (const attachment of parsed.attachments) {
                  if (attachment.contentType === 'application/pdf') {
                    // Ensure pdfs directory exists
                    const pdfDir = path.join(process.cwd(), 'pdfs');
                    if (!fs.existsSync(pdfDir)) {
                      fs.mkdirSync(pdfDir, { recursive: true });
                    }

                    // Save PDF file
                    const fileName = `${Date.now()}-${attachment.filename}`;
                    const filePath = path.join(pdfDir, fileName);
                    fs.writeFileSync(filePath, attachment.content);

                    // Save metadata to database
                    await prisma.pDFMetadata.create({
                      data: {
                        fromAddress: parsed.from?.text || '',
                        dateReceived: parsed.date || new Date(),
                        subject: parsed.subject || '',
                        fileName: fileName,
                        localPath: filePath,
                        configId: config.id,
                      },
                    });
                  }
                }
              }
            });
          });

          f.once('error', (err) => {
            reject(err);
          });

          f.once('end', () => {
            imap.end();
            resolve(true);
          });
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.connect();
  });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const config = await prisma.emailIngestionConfig.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    if (!config.active) {
      return NextResponse.json(
        { error: 'Configuration is not active' },
        { status: 400 }
      );
    }

    switch (config.connectionType) {
      case 'IMAP':
        await checkImapInbox(config);
        break;
      // Add handlers for other connection types here
      default:
        return NextResponse.json(
          { error: 'Unsupported connection type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error checking inbox:', error);
    return NextResponse.json(
      { error: 'Failed to check inbox' },
      { status: 500 }
    );
  }
}
