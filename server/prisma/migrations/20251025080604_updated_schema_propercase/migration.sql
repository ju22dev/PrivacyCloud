/*
  Warnings:

  - You are about to drop the `MetaData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoredData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MetaData" DROP CONSTRAINT "MetaData_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StoredData" DROP CONSTRAINT "StoredData_userId_fkey";

-- DropTable
DROP TABLE "public"."MetaData";

-- DropTable
DROP TABLE "public"."StoredData";

-- CreateTable
CREATE TABLE "Storeddata" (
    "id" SERIAL NOT NULL,
    "dataName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Storeddata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "dataName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Storeddata" ADD CONSTRAINT "Storeddata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
