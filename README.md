# Email PDF Ingestion Application

This Next.js application automatically checks configured email accounts for PDF attachments and downloads them locally.

## Project Structure

```
email-pdf-ingestion/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── email-ingestion/
│   │   │       ├── configs/
│   │   │       └── check-inbox/
│   │   └── page.tsx
│   └── components/
│       ├── EmailConfigForm.tsx
│       └── ConfigList.tsx
├── prisma/
│   └── schema.prisma
├── pdfs/           # Downloaded PDFs are stored here
└── .env           # Environment variables
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/email_pdf_ingestion"
   ```

3. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- For Outlook/Graph API (if used):
  - `OUTLOOK_CLIENT_ID`
  - `OUTLOOK_CLIENT_SECRET`
  - `OUTLOOK_TENANT_ID`

## Testing the Application

1. Configure an email account:
   - Go to the application UI
   - Fill in the email configuration form
   - For IMAP, you'll need:
     - Email address
     - Username
     - Password
     - Host (e.g., imap.gmail.com)
     - Port (e.g., 993)
     - SSL enabled

2. Send a test email:
   - Send an email to the configured address
   - Attach a PDF file
   - The application will automatically download it to the `pdfs/` directory

3. Verify:
   - Check the `pdfs/` directory for downloaded files
   - View the metadata in the database using Prisma Studio:
     ```bash
     npx prisma studio
     ```

## Features

- Support for multiple email protocols (IMAP, POP3, Gmail API, Outlook API)
- Automatic PDF attachment detection and download
- Local storage of PDFs with metadata
- Simple web interface for configuration management
- Active/inactive status for each configuration

## Notes

- The application creates a `pdfs/` directory in the project root to store downloaded PDFs
- Email credentials are stored in plain text - in a production environment, proper encryption should be implemented
- For Gmail accounts, you may need to enable "Less secure app access" or use an App Password
- For Outlook/Microsoft Graph API integration, you'll need to register an application in the Azure portal
