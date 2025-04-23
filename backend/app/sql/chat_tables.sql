-- Criação das tabelas para o sistema de chat

-- Tabela de grupos de chat
CREATE TABLE IF NOT EXISTS chat_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_by TEXT NOT NULL, -- user_id do Firebase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES users(uid) ON DELETE CASCADE
);

-- Índices para a tabela de grupos
CREATE INDEX IF NOT EXISTS idx_chat_groups_created_by ON chat_groups(created_by);

-- Tabela de membros de grupo
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- user_id do Firebase
    group_id UUID NOT NULL,
    role TEXT DEFAULT 'member', -- 'admin', 'member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES chat_groups(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_group UNIQUE (user_id, group_id)
);

-- Índices para a tabela de membros de grupo
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    group_id UUID NOT NULL,
    sender_id TEXT NOT NULL, -- user_id do Firebase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    is_edited BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES chat_groups(id) ON DELETE CASCADE
);

-- Índices para a tabela de mensagens
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Política de acesso RLS (Row Level Security)

-- Habilitar RLS nas tabelas
ALTER TABLE chat_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas para chat_groups
CREATE POLICY "Grupos públicos visíveis para todos" ON chat_groups
    FOR SELECT
    USING (NOT is_private);

CREATE POLICY "Grupos privados visíveis para membros" ON chat_groups
    FOR SELECT
    USING (
        is_private AND
        EXISTS (
            SELECT 1 FROM group_members 
            WHERE group_members.group_id = chat_groups.id 
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem criar grupos" ON chat_groups
    FOR INSERT
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Administradores podem atualizar grupos" ON chat_groups
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM group_members 
            WHERE group_members.group_id = chat_groups.id 
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

-- Políticas para group_members
CREATE POLICY "Membros visíveis para membros do mesmo grupo" ON group_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members AS gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
        )
    );

CREATE POLICY "Administradores podem adicionar membros" ON group_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM group_members AS gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
            AND gm.role = 'admin'
        )
    );

-- Políticas para messages
CREATE POLICY "Mensagens visíveis para membros do grupo" ON messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = messages.group_id
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem enviar mensagens aos grupos que pertencem" ON messages
    FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = messages.group_id
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem editar suas próprias mensagens" ON messages
    FOR UPDATE
    USING (sender_id = auth.uid()); 