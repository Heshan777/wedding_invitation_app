-- CreateEnum
CREATE TYPE "InviteType" AS ENUM ('SINGLE', 'COUPLE', 'FAMILY');

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "salutation" TEXT NOT NULL,
    "inviteType" "InviteType" NOT NULL DEFAULT 'SINGLE',
    "tableNumber" INTEGER NOT NULL,
    "notes" TEXT,
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "coupleNames" TEXT NOT NULL DEFAULT 'Ranudha & Dimuthu',
    "hostIntro" TEXT NOT NULL DEFAULT 'With gratitude and joyful hearts, we cordially invite',
    "invitationBody" TEXT NOT NULL DEFAULT 'to join us as we celebrate this special day...',
    "eventDate" TIMESTAMP(3) NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "venueLat" DOUBLE PRECISION NOT NULL,
    "venueLng" DOUBLE PRECISION NOT NULL,
    "heroImageUrl" TEXT,
    "musicUrl" TEXT DEFAULT '/audio/background.mp3',

    CONSTRAINT "EventSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_token_key" ON "Guest"("token");
