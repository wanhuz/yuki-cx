-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnimeScheduler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ab_id" INTEGER NOT NULL,
    "series_name" TEXT NOT NULL,
    "filter_property" TEXT NOT NULL DEFAULT '720p',
    "last_fetched_episode" INTEGER NOT NULL DEFAULT 0,
    "last_fetched_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soft_deleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_AnimeScheduler" ("ab_id", "filter_property", "id", "series_name", "soft_deleted") SELECT "ab_id", "filter_property", "id", "series_name", "soft_deleted" FROM "AnimeScheduler";
DROP TABLE "AnimeScheduler";
ALTER TABLE "new_AnimeScheduler" RENAME TO "AnimeScheduler";
CREATE UNIQUE INDEX "AnimeScheduler_ab_id_key" ON "AnimeScheduler"("ab_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
