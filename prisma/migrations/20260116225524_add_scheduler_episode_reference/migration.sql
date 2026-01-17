-- CreateTable
CREATE TABLE "AnimeSchedulerEpisodeReference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "episode_title" TEXT,
    "episode_number" INTEGER NOT NULL,
    "episode_date" DATETIME,
    "scheduler_ref_id" INTEGER NOT NULL,
    CONSTRAINT "AnimeSchedulerEpisodeReference_scheduler_ref_id_fkey" FOREIGN KEY ("scheduler_ref_id") REFERENCES "AnimeSchedulerReference" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeSchedulerEpisodeReference_scheduler_ref_id_episode_number_key" ON "AnimeSchedulerEpisodeReference"("scheduler_ref_id", "episode_number");
