-- CreateTable
CREATE TABLE "Rounds" (
    "id" SERIAL NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "winnerId" INTEGER,

    CONSTRAINT "Rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoundPlayers" (
    "roundId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "taps" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoundPlayers_pkey" PRIMARY KEY ("roundId","userId")
);

-- AddForeignKey
ALTER TABLE "Rounds" ADD CONSTRAINT "Rounds_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundPlayers" ADD CONSTRAINT "RoundPlayers_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundPlayers" ADD CONSTRAINT "RoundPlayers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
