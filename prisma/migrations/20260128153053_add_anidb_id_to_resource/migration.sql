/*
  Warnings:

  - Added the required column `ab_id` to the `AnimeResource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ab_title` to the `AnimeResource` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnimeResource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ab_id" INTEGER NOT NULL,
    "ab_title" TEXT NOT NULL,
    "anidb_id" INTEGER NOT NULL,
    "banner_url" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL
);
INSERT INTO "new_AnimeResource" ("anidb_id", "banner_url", "id", "logo_url") SELECT "anidb_id", "banner_url", "id", "logo_url" FROM "AnimeResource";
DROP TABLE "AnimeResource";
ALTER TABLE "new_AnimeResource" RENAME TO "AnimeResource";
CREATE UNIQUE INDEX "AnimeResource_anidb_id_key" ON "AnimeResource"("anidb_id");
CREATE TABLE "new_AnimeScheduler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ab_id" INTEGER NOT NULL,
    "anidb_id" INTEGER NOT NULL DEFAULT -1,
    "mal_id" INTEGER NOT NULL DEFAULT -1,
    "anilist_id" INTEGER NOT NULL DEFAULT -1,
    "tvdb_id" INTEGER NOT NULL DEFAULT -1,
    "series_name" TEXT NOT NULL,
    "filter_property" TEXT NOT NULL DEFAULT '720p',
    "last_fetched_episode" INTEGER NOT NULL DEFAULT 0,
    "last_fetched_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soft_deleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_AnimeScheduler" ("ab_id", "anidb_id", "anilist_id", "filter_property", "id", "last_fetched_at", "last_fetched_episode", "mal_id", "series_name", "soft_deleted") SELECT "ab_id", coalesce("anidb_id", -1) AS "anidb_id", coalesce("anilist_id", -1) AS "anilist_id", "filter_property", "id", "last_fetched_at", "last_fetched_episode", coalesce("mal_id", -1) AS "mal_id", "series_name", "soft_deleted" FROM "AnimeScheduler";
DROP TABLE "AnimeScheduler";
ALTER TABLE "new_AnimeScheduler" RENAME TO "AnimeScheduler";
CREATE UNIQUE INDEX "AnimeScheduler_ab_id_key" ON "AnimeScheduler"("ab_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
