/*
  Warnings:

  - You are about to drop the column `number` on the `PrintingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `pageNumber` on the `PrintingRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrintingRequest" DROP COLUMN "number",
DROP COLUMN "pageNumber",
ADD COLUMN     "numFiles" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numPages" INTEGER NOT NULL DEFAULT 0;
