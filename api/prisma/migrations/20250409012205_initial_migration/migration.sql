/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `filmeId` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `perfilId` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Comunidade` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Comunidade` table. All the data in the column will be lost.
  - You are about to drop the column `comunidadeId` on the `Enquete` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Enquete` table. All the data in the column will be lost.
  - You are about to drop the column `filmeId` on the `Enquete` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Enquete` table. All the data in the column will be lost.
  - You are about to drop the column `comunidadeId` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `perfilId` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Forum` table. All the data in the column will be lost.
  - You are about to drop the column `filmeId` on the `Forum` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Forum` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Notificacao` table. All the data in the column will be lost.
  - You are about to drop the column `perfilId` on the `Notificacao` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Notificacao` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Perfil` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Perfil` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Perfil` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `forumId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `perfilId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Recomendacao` table. All the data in the column will be lost.
  - You are about to drop the column `filmeId` on the `Recomendacao` table. All the data in the column will be lost.
  - You are about to drop the column `perfilId` on the `Recomendacao` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Recomendacao` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `FilmesAssistidos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FilmesCriticas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FilmesFavoritos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FilmesWatchLater` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `filme_id` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil_id` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comunidade_id` to the `Enquete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comunidade_id` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil_id` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filme_id` to the `Forum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil_id` to the `Notificacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `Perfil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forum_id` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil_id` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filme_id` to the `Recomendacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil_id` to the `Recomendacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "Enquete" DROP CONSTRAINT "Enquete_comunidadeId_fkey";

-- DropForeignKey
ALTER TABLE "Enquete" DROP CONSTRAINT "Enquete_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "Evento" DROP CONSTRAINT "Evento_comunidadeId_fkey";

-- DropForeignKey
ALTER TABLE "Evento" DROP CONSTRAINT "Evento_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "FilmesAssistidos" DROP CONSTRAINT "FilmesAssistidos_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "FilmesAssistidos" DROP CONSTRAINT "FilmesAssistidos_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "FilmesCriticas" DROP CONSTRAINT "FilmesCriticas_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "FilmesCriticas" DROP CONSTRAINT "FilmesCriticas_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "FilmesFavoritos" DROP CONSTRAINT "FilmesFavoritos_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "FilmesFavoritos" DROP CONSTRAINT "FilmesFavoritos_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "FilmesWatchLater" DROP CONSTRAINT "FilmesWatchLater_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "FilmesWatchLater" DROP CONSTRAINT "FilmesWatchLater_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "Forum" DROP CONSTRAINT "Forum_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "Notificacao" DROP CONSTRAINT "Notificacao_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "Perfil" DROP CONSTRAINT "Perfil_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_forumId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "Recomendacao" DROP CONSTRAINT "Recomendacao_filmeId_fkey";

-- DropForeignKey
ALTER TABLE "Recomendacao" DROP CONSTRAINT "Recomendacao_perfilId_fkey";

-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "createdAt",
DROP COLUMN "filmeId",
DROP COLUMN "perfilId",
DROP COLUMN "updatedAt",
ADD COLUMN     "filme_id" INTEGER NOT NULL,
ADD COLUMN     "perfil_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Comunidade" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Enquete" DROP COLUMN "comunidadeId",
DROP COLUMN "createdAt",
DROP COLUMN "filmeId",
DROP COLUMN "updatedAt",
ADD COLUMN     "comunidade_id" INTEGER NOT NULL,
ADD COLUMN     "filme_id" INTEGER;

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "comunidadeId",
DROP COLUMN "createdAt",
DROP COLUMN "perfilId",
DROP COLUMN "updatedAt",
ADD COLUMN     "comunidade_id" INTEGER NOT NULL,
ADD COLUMN     "perfil_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Filme" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Forum" DROP COLUMN "createdAt",
DROP COLUMN "filmeId",
DROP COLUMN "updatedAt",
ADD COLUMN     "filme_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Notificacao" DROP COLUMN "createdAt",
DROP COLUMN "perfilId",
DROP COLUMN "updatedAt",
ADD COLUMN     "perfil_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Perfil" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "usuarioId",
ADD COLUMN     "usuario_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "createdAt",
DROP COLUMN "forumId",
DROP COLUMN "perfilId",
DROP COLUMN "updatedAt",
ADD COLUMN     "forum_id" INTEGER NOT NULL,
ADD COLUMN     "perfil_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Recomendacao" DROP COLUMN "createdAt",
DROP COLUMN "filmeId",
DROP COLUMN "perfilId",
DROP COLUMN "updatedAt",
ADD COLUMN     "filme_id" INTEGER NOT NULL,
ADD COLUMN     "perfil_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "FilmesAssistidos";

-- DropTable
DROP TABLE "FilmesCriticas";

-- DropTable
DROP TABLE "FilmesFavoritos";

-- DropTable
DROP TABLE "FilmesWatchLater";

-- DropTable
DROP TABLE "Movie";

-- CreateTable
CREATE TABLE "filmesCriticas" (
    "perfil_id" INTEGER NOT NULL,
    "filme_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "filmesCriticas_pkey" PRIMARY KEY ("perfil_id","filme_id")
);

-- CreateTable
CREATE TABLE "_FilmesAssistidos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FilmesFavoritos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FilmesWatchLater" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FilmesAssistidos_AB_unique" ON "_FilmesAssistidos"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmesAssistidos_B_index" ON "_FilmesAssistidos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilmesFavoritos_AB_unique" ON "_FilmesFavoritos"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmesFavoritos_B_index" ON "_FilmesFavoritos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilmesWatchLater_AB_unique" ON "_FilmesWatchLater"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmesWatchLater_B_index" ON "_FilmesWatchLater"("B");

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum" ADD CONSTRAINT "Forum_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "Forum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "Comunidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquete" ADD CONSTRAINT "Enquete_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "Comunidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquete" ADD CONSTRAINT "Enquete_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "Filme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recomendacao" ADD CONSTRAINT "Recomendacao_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recomendacao" ADD CONSTRAINT "Recomendacao_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filmesCriticas" ADD CONSTRAINT "filmesCriticas_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filmesCriticas" ADD CONSTRAINT "filmesCriticas_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmesAssistidos" ADD CONSTRAINT "_FilmesAssistidos_A_fkey" FOREIGN KEY ("A") REFERENCES "Filme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmesAssistidos" ADD CONSTRAINT "_FilmesAssistidos_B_fkey" FOREIGN KEY ("B") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmesFavoritos" ADD CONSTRAINT "_FilmesFavoritos_A_fkey" FOREIGN KEY ("A") REFERENCES "Filme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmesFavoritos" ADD CONSTRAINT "_FilmesFavoritos_B_fkey" FOREIGN KEY ("B") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmesWatchLater" ADD CONSTRAINT "_FilmesWatchLater_A_fkey" FOREIGN KEY ("A") REFERENCES "Filme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmesWatchLater" ADD CONSTRAINT "_FilmesWatchLater_B_fkey" FOREIGN KEY ("B") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
