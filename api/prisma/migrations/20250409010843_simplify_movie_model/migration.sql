/*
  Warnings:

  - You are about to drop the column `duration` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `posterUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Movie` table. All the data in the column will be lost.
  - The `genre` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "duration",
DROP COLUMN "posterUrl",
DROP COLUMN "releaseYear",
ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "cast" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "director" DROP NOT NULL,
DROP COLUMN "genre",
ADD COLUMN     "genre" TEXT[] DEFAULT ARRAY[]::TEXT[];
