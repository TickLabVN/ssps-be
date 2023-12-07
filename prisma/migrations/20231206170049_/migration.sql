/*
  Warnings:

  - A unique constraint covering the columns `[minioName]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "File_previewMinioName_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_minioName_key" ON "File"("minioName");
