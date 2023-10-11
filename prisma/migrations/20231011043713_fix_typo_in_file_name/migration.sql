/*
  Warnings:

  - You are about to drop the column `fileName` on the `PrintingRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrintingRequest" DROP COLUMN "fileName",
ADD COLUMN     "fileNames" TEXT[];
