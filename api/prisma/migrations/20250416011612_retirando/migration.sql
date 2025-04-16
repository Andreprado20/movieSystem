/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `perfil_id` to the `Comentario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_forum_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_perfil_id_fkey";

-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "perfil_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Post";

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
