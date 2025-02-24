import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const configs = await prisma.emailIngestionConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(configs);
  } catch (error) {
    console.error('Error fetching configs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configurations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const config = await prisma.emailIngestionConfig.create({
      data: {
        emailAddress: data.emailAddress,
        connectionType: data.connectionType,
        username: data.username,
        password: data.password,
        host: data.host,
        port: data.port ? parseInt(data.port) : null,
        useSSL: data.useSSL,
      },
    });
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error creating config:', error);
    return NextResponse.json(
      { error: 'Failed to create configuration' },
      { status: 500 }
    );
  }
}
