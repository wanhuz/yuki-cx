-- CreateTable
CREATE TABLE "AnimeSchedulerReference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scheduler_id" INTEGER NOT NULL,
    "series_name" TEXT NOT NULL,
    "studio_name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "poster_url" TEXT NOT NULL,
    CONSTRAINT "AnimeSchedulerReference_scheduler_id_fkey" FOREIGN KEY ("scheduler_id") REFERENCES "AnimeScheduler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnimeScheduler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ab_id" INTEGER NOT NULL,
    "series_name" TEXT NOT NULL,
    "filter_property" TEXT,
    "soft_deleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_AnimeScheduler" ("ab_id", "id", "series_name") SELECT "ab_id", "id", "series_name" FROM "AnimeScheduler";
DROP TABLE "AnimeScheduler";
ALTER TABLE "new_AnimeScheduler" RENAME TO "AnimeScheduler";
CREATE UNIQUE INDEX "AnimeScheduler_ab_id_key" ON "AnimeScheduler"("ab_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
