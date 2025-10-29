/*
  Warnings:

  - You are about to drop the column `data` on the `StoredData` table. All the data in the column will be lost.
  - Added the required column `dataName` to the `StoredData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoredData" DROP COLUMN "data",
ADD COLUMN     "dataName" TEXT NOT NULL;
