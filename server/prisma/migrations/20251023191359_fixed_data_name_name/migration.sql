/*
  Warnings:

  - You are about to drop the column `data` on the `MetaData` table. All the data in the column will be lost.
  - Added the required column `dataName` to the `MetaData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MetaData" DROP COLUMN "data",
ADD COLUMN     "dataName" TEXT NOT NULL;
