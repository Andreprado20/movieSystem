-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "firebase_uid" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "supabase_uid" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "auth_provider" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebase_uid_key" ON "Usuario"("firebase_uid");
CREATE UNIQUE INDEX "Usuario_supabase_uid_key" ON "Usuario"("supabase_uid"); 