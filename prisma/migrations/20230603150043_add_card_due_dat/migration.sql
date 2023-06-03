/*
  Warnings:

  - You are about to drop the column `lastLearned` on the `CardStat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CardStat" DROP COLUMN "lastLearned",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
