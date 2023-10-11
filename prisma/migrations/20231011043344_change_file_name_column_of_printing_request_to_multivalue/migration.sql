/*
  Warnings:

  - The `fileName` column on the `PrintingRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PrintingRequest" DROP COLUMN "fileName",
ADD COLUMN     "fileName" TEXT[];
