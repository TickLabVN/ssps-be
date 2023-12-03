/*
  Warnings:

  - You are about to drop the column `fileNames` on the `PrintingRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrintingRequest" DROP COLUMN "fileNames";

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "minioName" TEXT NOT NULL,
    "pritingRequestId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_minioName_key" ON "File"("minioName");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_pritingRequestId_fkey" FOREIGN KEY ("pritingRequestId") REFERENCES "PrintingRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
