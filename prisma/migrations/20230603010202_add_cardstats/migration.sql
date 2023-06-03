/*
  Warnings:

  - Added the required column `repeat` to the `CardStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `successful` to the `CardStat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardStat" ADD COLUMN     "repeat" INTEGER NOT NULL,
ADD COLUMN     "successful" INTEGER NOT NULL;
