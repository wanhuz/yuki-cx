-- CreateTable
CREATE TABLE "HomepageHero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "HomepageItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "heroId" INTEGER NOT NULL,
    "animeResourceId" INTEGER NOT NULL,
    CONSTRAINT "HomepageItem_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "HomepageHero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HomepageItem_animeResourceId_fkey" FOREIGN KEY ("animeResourceId") REFERENCES "AnimeResource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
