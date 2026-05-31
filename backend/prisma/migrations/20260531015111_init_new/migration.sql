/*
  Warnings:

  - You are about to drop the `Supply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Survivor` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "age" INTEGER;
ALTER TABLE "User" ADD COLUMN "aiOpinion" TEXT;
ALTER TABLE "User" ADD COLUMN "baseLocation" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Supply";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Survivor";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CountryReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "topic" TEXT NOT NULL DEFAULT '',
    "severity" TEXT NOT NULL DEFAULT 'Moderate',
    "cases" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL DEFAULT '',
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL
);
INSERT INTO "new_CountryReport" ("cases", "countryCode", "countryName", "createAt", "id", "note", "severity", "updateAt") SELECT "cases", "countryCode", "countryName", "createAt", "id", "note", "severity", "updateAt" FROM "CountryReport";
DROP TABLE "CountryReport";
ALTER TABLE "new_CountryReport" RENAME TO "CountryReport";
CREATE TABLE "new_SurvivalStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'days',
    "userId" TEXT NOT NULL,
    CONSTRAINT "SurvivalStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SurvivalStat" ("id", "name", "userId", "value") SELECT "id", "name", "userId", "value" FROM "SurvivalStat";
DROP TABLE "SurvivalStat";
ALTER TABLE "new_SurvivalStat" RENAME TO "SurvivalStat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
