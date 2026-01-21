/*
  Warnings:

  - Made the column `episode_date` on table `AnimeSchedulerEpisodeReference` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnimeSchedulerEpisodeReference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "episode_title" TEXT,
    "episode_number" INTEGER NOT NULL,
    "episode_date" DATETIME NOT NULL,
    "scheduler_ref_id" INTEGER NOT NULL,
    CONSTRAINT "AnimeSchedulerEpisodeReference_scheduler_ref_id_fkey" FOREIGN KEY ("scheduler_ref_id") REFERENCES "AnimeSchedulerReference" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AnimeSchedulerEpisodeReference" ("episode_date", "episode_number", "episode_title", "id", "scheduler_ref_id") SELECT "episode_date", "episode_number", "episode_title", "id", "scheduler_ref_id" FROM "AnimeSchedulerEpisodeReference";
DROP TABLE "AnimeSchedulerEpisodeReference";
ALTER TABLE "new_AnimeSchedulerEpisodeReference" RENAME TO "AnimeSchedulerEpisodeReference";
CREATE UNIQUE INDEX "AnimeSchedulerEpisodeReference_scheduler_ref_id_episode_number_key" ON "AnimeSchedulerEpisodeReference"("scheduler_ref_id", "episode_number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
