/*
  Warnings:

  - You are about to drop the column `location` on the `PrintingRequest` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `PrintingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrintingRequest" DROP COLUMN "location",
ADD COLUMN     "addressId" TEXT NOT NULL,
ALTER COLUMN "pageNumber" SET DEFAULT 0,
ALTER COLUMN "coins" SET DEFAULT 0,
ALTER COLUMN "number" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrintingRequest" ADD CONSTRAINT "PrintingRequest_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
