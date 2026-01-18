-- CreateTable
CREATE TABLE "DownloadLogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "scheduler_torrent_id" INTEGER,
    "download_at" DATETIME NOT NULL
);
