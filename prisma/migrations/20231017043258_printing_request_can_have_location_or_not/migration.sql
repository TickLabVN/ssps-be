-- DropForeignKey
ALTER TABLE "PrintingRequest" DROP CONSTRAINT "PrintingRequest_locationId_fkey";

-- AlterTable
ALTER TABLE "PrintingRequest" ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PrintingRequest" ADD CONSTRAINT "PrintingRequest_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
