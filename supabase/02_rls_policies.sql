-- ============================================================
-- 02 — ROW LEVEL SECURITY (RLS)
-- Rodar DEPOIS de 01_create_table_usuarios.sql
-- ============================================================

-- Habilitar RLS na tabela
alter table public.concremtp_usuarios enable row level security;

-- Política: qualquer usuário autenticado lê o próprio perfil
create policy "usuario_le_proprio_perfil"
  on public.concremtp_usuarios
  for select
  using ( auth.uid() = id );

-- Política: administrador lê todos os perfis
create policy "admin_le_todos"
  on public.concremtp_usuarios
  for select
  using (
    exists (
      select 1 from public.concremtp_usuarios
      where id = auth.uid() and nivel = 'administrador'
    )
  );

-- Política: administrador insere novos usuários
create policy "admin_insere_usuario"
  on public.concremtp_usuarios
  for insert
  with check (
    exists (
      select 1 from public.concremtp_usuarios
      where id = auth.uid() and nivel = 'administrador'
    )
  );

-- Política: administrador atualiza qualquer perfil
create policy "admin_atualiza_usuario"
  on public.concremtp_usuarios
  for update
  using (
    exists (
      select 1 from public.concremtp_usuarios
      where id = auth.uid() and nivel = 'administrador'
    )
  );

-- Política: usuário atualiza o próprio perfil (nome/nivel não — apenas dados pessoais futuros)
create policy "usuario_atualiza_proprio"
  on public.concremtp_usuarios
  for update
  using ( auth.uid() = id );
