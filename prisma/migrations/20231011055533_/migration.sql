/*
  Warnings:

  - You are about to drop the column `pritingRequestId` on the `File` table. All the data in the column will be lost.
  - Added the required column `printingRequestId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_pritingRequestId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "pritingRequestId",
ADD COLUMN     "printingRequestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_printingRequestId_fkey" FOREIGN KEY ("printingRequestId") REFERENCES "PrintingRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
