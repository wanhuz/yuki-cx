/*
  Warnings:

  - A unique constraint covering the columns `[ab_id]` on the table `AnimeScheduler` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AnimeScheduler_ab_id_key" ON "AnimeScheduler"("ab_id");
