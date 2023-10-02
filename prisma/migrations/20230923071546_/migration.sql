-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
