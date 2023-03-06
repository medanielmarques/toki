/*
  Warnings:

  - You are about to drop the column `auto_start_breaks` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `auto_start_pomodoros` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `current_long_break_interval_count` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `long_break_count` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `long_break_interval` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `long_break_time` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `pomodoro_count` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `pomodoro_time` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `short_break_count` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `short_break_time` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Timer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Timer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `autoStartBreaks` to the `Timer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autoStartPomodoros` to the `Timer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Timer" DROP CONSTRAINT "Timer_user_id_fkey";

-- DropIndex
DROP INDEX "Timer_user_id_key";

-- AlterTable
ALTER TABLE "Timer" DROP COLUMN "auto_start_breaks",
DROP COLUMN "auto_start_pomodoros",
DROP COLUMN "current_long_break_interval_count",
DROP COLUMN "long_break_count",
DROP COLUMN "long_break_interval",
DROP COLUMN "long_break_time",
DROP COLUMN "pomodoro_count",
DROP COLUMN "pomodoro_time",
DROP COLUMN "short_break_count",
DROP COLUMN "short_break_time",
DROP COLUMN "user_id",
ADD COLUMN     "autoStartBreaks" BOOLEAN NOT NULL,
ADD COLUMN     "autoStartPomodoros" BOOLEAN NOT NULL,
ADD COLUMN     "currentLongBreakIntervalCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longBreakCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longBreakInterval" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "longBreakTime" INTEGER NOT NULL DEFAULT 900000,
ADD COLUMN     "pomodoroCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pomodoroTime" INTEGER NOT NULL DEFAULT 1500000,
ADD COLUMN     "shortBreakCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shortBreakTime" INTEGER NOT NULL DEFAULT 300000,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Timer_userId_key" ON "Timer"("userId");

-- AddForeignKey
ALTER TABLE "Timer" ADD CONSTRAINT "Timer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
