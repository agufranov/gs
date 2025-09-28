/*
  Warnings:

  - You are about to drop the column `winnerId` on the `Rounds` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rounds" DROP CONSTRAINT "Rounds_winnerId_fkey";

-- AlterTable
ALTER TABLE "Rounds" DROP COLUMN "winnerId",
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Rounds" ADD CONSTRAINT "Rounds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
