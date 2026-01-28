-- CreateTable
CREATE TABLE "AnimeResource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anidb_id" INTEGER NOT NULL,
    "banner_url" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeResource_anidb_id_key" ON "AnimeResource"("anidb_id");
