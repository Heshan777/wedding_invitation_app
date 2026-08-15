/*
  Warnings:

  - You are about to drop the column `InviteType` on the `Guest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "coupleNames" TEXT NOT NULL DEFAULT 'Ranudha & Dimuthu',
    "hostIntro" TEXT NOT NULL DEFAULT 'With gratitude and joyful hearts, we cordially invite',
    "invitationBody" TEXT NOT NULL DEFAULT 'to join us as we celebrate this special day...',
    "eventDate" DATETIME NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "venueLat" REAL NOT NULL,
    "venueLng" REAL NOT NULL,
    "heroImageUrl" TEXT,
    "musicUrl" TEXT DEFAULT '/audio/background.mp3'
);
INSERT INTO "new_EventSettings" ("coupleNames", "eventDate", "heroImageUrl", "id", "musicUrl", "venueAddress", "venueLat", "venueLng", "venueName") SELECT "coupleNames", "eventDate", "heroImageUrl", "id", "musicUrl", "venueAddress", "venueLat", "venueLng", "venueName" FROM "EventSettings";
DROP TABLE "EventSettings";
ALTER TABLE "new_EventSettings" RENAME TO "EventSettings";
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "salutation" TEXT NOT NULL,
    "inviteType" TEXT NOT NULL DEFAULT 'SINGLE',
    "tableNumber" INTEGER NOT NULL,
    "notes" TEXT,
    "viewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Guest" ("createdAt", "displayName", "id", "notes", "salutation", "tableNumber", "token", "updatedAt", "viewedAt") SELECT "createdAt", "displayName", "id", "notes", "salutation", "tableNumber", "token", "updatedAt", "viewedAt" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_token_key" ON "Guest"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
