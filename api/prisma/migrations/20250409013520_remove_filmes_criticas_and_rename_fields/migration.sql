/*
  Warnings:

  - You are about to drop the `_FilmesAssistidos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FilmesFavoritos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FilmesWatchLater` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filmesCriticas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FilmesAssistidos" DROP CONSTRAINT "_FilmesAssistidos_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilmesAssistidos" DROP CONSTRAINT "_FilmesAssistidos_B_fkey";

-- DropForeignKey
ALTER TABLE "_FilmesFavoritos" DROP CONSTRAINT "_FilmesFavoritos_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilmesFavoritos" DROP CONSTRAINT "_FilmesFavoritos_B_fkey";

-- DropForeignKey
ALTER TABLE "_FilmesWatchLater" DROP CONSTRAINT "_FilmesWatchLater_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilmesWatchLater" DROP CONSTRAINT "_FilmesWatchLater_B_fkey";

-- DropForeignKey
ALTER TABLE "filmesCriticas" DROP CONSTRAINT "filmesCriticas_filme_id_fkey";

-- DropForeignKey
ALTER TABLE "filmesCriticas" DROP CONSTRAINT "filmesCriticas_perfil_id_fkey";

-- DropTable
DROP TABLE "_FilmesAssistidos";

-- DropTable
DROP TABLE "_FilmesFavoritos";

-- DropTable
DROP TABLE "_FilmesWatchLater";

-- DropTable
DROP TABLE "filmesCriticas";

-- CreateTable
CREATE TABLE "FilmesAssistidos" (
    "id" SERIAL NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "filme_id" INTEGER NOT NULL,

    CONSTRAINT "FilmesAssistidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmesFavoritos" (
    "id" SERIAL NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "filme_id" INTEGER NOT NULL,

    CONSTRAINT "FilmesFavoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmesWatchLater" (
    "id" SERIAL NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "filme_id" INTEGER NOT NULL,

    CONSTRAINT "FilmesWatchLater_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FilmesAssistidos_perfil_id_filme_id_key" ON "FilmesAssistidos"("perfil_id", "filme_id");

-- CreateIndex
CREATE UNIQUE INDEX "FilmesFavoritos_perfil_id_filme_id_key" ON "FilmesFavoritos"("perfil_id", "filme_id");

-- CreateIndex
CREATE UNIQUE INDEX "FilmesWatchLater_perfil_id_filme_id_key" ON "FilmesWatchLater"("perfil_id", "filme_id");

-- AddForeignKey
ALTER TABLE "FilmesAssistidos" ADD CONSTRAINT "FilmesAssistidos_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmesAssistidos" ADD CONSTRAINT "FilmesAssistidos_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmesFavoritos" ADD CONSTRAINT "FilmesFavoritos_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmesFavoritos" ADD CONSTRAINT "FilmesFavoritos_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmesWatchLater" ADD CONSTRAINT "FilmesWatchLater_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmesWatchLater" ADD CONSTRAINT "FilmesWatchLater_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
