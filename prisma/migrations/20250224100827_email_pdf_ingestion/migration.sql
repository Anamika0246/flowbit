-- CreateTable
CREATE TABLE "EmailIngestionConfig" (
    "id" SERIAL NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "host" TEXT,
    "port" INTEGER,
    "useSSL" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmailIngestionConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PDFMetadata" (
    "id" SERIAL NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "localPath" TEXT NOT NULL,
    "configId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PDFMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailIngestionConfig_emailAddress_key" ON "EmailIngestionConfig"("emailAddress");

-- AddForeignKey
ALTER TABLE "PDFMetadata" ADD CONSTRAINT "PDFMetadata_configId_fkey" FOREIGN KEY ("configId") REFERENCES "EmailIngestionConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
