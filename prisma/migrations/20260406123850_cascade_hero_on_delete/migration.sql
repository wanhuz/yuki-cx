-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HomepageItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "heroId" INTEGER NOT NULL,
    "animeResourceId" INTEGER NOT NULL,
    CONSTRAINT "HomepageItem_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "HomepageHero" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HomepageItem_animeResourceId_fkey" FOREIGN KEY ("animeResourceId") REFERENCES "AnimeResource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HomepageItem" ("animeResourceId", "created_at", "heroId", "id") SELECT "animeResourceId", "created_at", "heroId", "id" FROM "HomepageItem";
DROP TABLE "HomepageItem";
ALTER TABLE "new_HomepageItem" RENAME TO "HomepageItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
