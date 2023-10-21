/*
  Warnings:

  - You are about to drop the column `addressId` on the `PrintingRequest` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `PrintingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PrintingRequest" DROP CONSTRAINT "PrintingRequest_addressId_fkey";

-- AlterTable
ALTER TABLE "PrintingRequest" DROP COLUMN "addressId",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PrintingRequest" ADD CONSTRAINT "PrintingRequest_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
