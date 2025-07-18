-- CreateTable
CREATE TABLE "ProcessedTorrent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "torrent_id" INTEGER NOT NULL,
    "processedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedTorrent_torrent_id_key" ON "ProcessedTorrent"("torrent_id");
