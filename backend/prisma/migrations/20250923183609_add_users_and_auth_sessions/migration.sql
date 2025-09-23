-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SURVIVOR', 'NIKITA');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SURVIVOR',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSessions" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuthSessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSessions_data_key" ON "AuthSessions"("data");

-- AddForeignKey
ALTER TABLE "AuthSessions" ADD CONSTRAINT "AuthSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
