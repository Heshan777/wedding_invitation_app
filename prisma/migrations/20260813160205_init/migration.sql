-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "salutation" TEXT NOT NULL,
    "InviteType" TEXT NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "notes" TEXT,
    "viewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EventSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "coupleNames" TEXT NOT NULL DEFAULT 'Ranudha & Dimuthu',
    "eventDate" DATETIME NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "venueLat" REAL NOT NULL,
    "venueLng" REAL NOT NULL,
    "heroImageUrl" TEXT,
    "musicUrl" TEXT DEFAULT '/audio/background.mp3'
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_token_key" ON "Guest"("token");
