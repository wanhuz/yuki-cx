-- CreateTable
CREATE TABLE "AnimeSchedulerFilter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scheduler_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "AnimeSchedulerFilter_scheduler_id_fkey" FOREIGN KEY ("scheduler_id") REFERENCES "AnimeScheduler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
