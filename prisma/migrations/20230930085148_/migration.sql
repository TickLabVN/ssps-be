-- CreateEnum
CREATE TYPE "PrintingStatus" AS ENUM ('progressing', 'ready', 'done', 'canceled');

-- CreateEnum
CREATE TYPE "Paid" AS ENUM ('paid', 'not_paid');

-- CreateTable
CREATE TABLE "PrintingRequest" (
    "id" TEXT NOT NULL,
    "status" "PrintingStatus" NOT NULL,
    "location" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL,
    "paid" "Paid" NOT NULL,

    CONSTRAINT "PrintingRequest_pkey" PRIMARY KEY ("id")
);
