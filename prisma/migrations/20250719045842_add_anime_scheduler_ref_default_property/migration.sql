-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnimeScheduler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ab_id" INTEGER NOT NULL,
    "series_name" TEXT NOT NULL,
    "filter_property" TEXT NOT NULL DEFAULT '720p',
    "soft_deleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_AnimeScheduler" ("ab_id", "filter_property", "id", "series_name", "soft_deleted") SELECT "ab_id", coalesce("filter_property", '720p') AS "filter_property", "id", "series_name", "soft_deleted" FROM "AnimeScheduler";
DROP TABLE "AnimeScheduler";
ALTER TABLE "new_AnimeScheduler" RENAME TO "AnimeScheduler";
CREATE UNIQUE INDEX "AnimeScheduler_ab_id_key" ON "AnimeScheduler"("ab_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
