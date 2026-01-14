-- CreateTable
CREATE TABLE "AnimeSchedulerEpisodeReference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "episode_title" TEXT,
    "episode_number" INTEGER,
    "episode_date" DATETIME,
    "scheduler_ref_id" INTEGER NOT NULL,
    CONSTRAINT "AnimeSchedulerEpisodeReference_scheduler_ref_id_fkey" FOREIGN KEY ("scheduler_ref_id") REFERENCES "AnimeSchedulerReference" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
