-- CreateTable
CREATE TABLE "ServiceMapping" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anidbid" INTEGER,
    "tvdbid" INTEGER,
    "tmdbid" INTEGER,
    "imdbid" INTEGER,
    "name" TEXT,
    "studio" TEXT
);
