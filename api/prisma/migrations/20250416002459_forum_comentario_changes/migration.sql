/*
  Warnings:

  - You are about to drop the column `categoria` on the `Forum` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Forum` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Forum" DROP COLUMN "categoria",
DROP COLUMN "titulo";

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "usuario_id" INTEGER NOT NULL,
    "forum_id" INTEGER NOT NULL,
    "respondendo_id" INTEGER,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "Forum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_respondendo_id_fkey" FOREIGN KEY ("respondendo_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
