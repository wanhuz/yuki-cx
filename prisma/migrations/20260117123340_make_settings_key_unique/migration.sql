/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Settings_key_key" ON "Settings"("key");
