/*
  Warnings:

  - You are about to drop the `ServiceMapping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ServiceMapping";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AnimeIdMap" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "anidb_id" INTEGER NOT NULL,
    "tvdb_id" INTEGER NOT NULL,
    "season_number" INTEGER NOT NULL,
    "resolved_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "AnimeIdMap_anidb_id_idx" ON "AnimeIdMap"("anidb_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeIdMap_anidb_id_tvdb_id_season_number_key" ON "AnimeIdMap"("anidb_id", "tvdb_id", "season_number");
