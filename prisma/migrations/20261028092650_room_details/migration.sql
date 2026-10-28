-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "details" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "features" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
