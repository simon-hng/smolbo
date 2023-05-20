/*
  Warnings:

  - You are about to drop the column `DeckId` on the `Card` table. All the data in the column will be lost.
  - Added the required column `deckId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_DeckId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "DeckId",
ADD COLUMN     "deckId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
