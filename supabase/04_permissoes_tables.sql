-- ============================================================
-- 04 — SISTEMA DE PERMISSÕES GRANULAR
-- Rodar DEPOIS de 01, 02 e 03
-- ============================================================

-- ── Tabela: concremtp_permissoes_perfil ───────────────────
create table if not exists public.concremtp_permissoes_perfil (
  id             uuid        primary key default gen_random_uuid(),
  perfil         text        not null unique
                             check (perfil in ('administrador', 'gerente', 'vendedor')),
  permissoes     jsonb       not null,
  atualizado_em  timestamptz not null default now(),
  atualizado_por uuid        references public.concremtp_usuarios(id)
);

-- ── Tabela: concremtp_permissoes_usuario ──────────────────
create table if not exists public.concremtp_permissoes_usuario (
  id                   uuid        primary key default gen_random_uuid(),
  usuario_id           uuid        not null unique references public.concremtp_usuarios(id) on delete cascade,
  permissoes_override  jsonb,
  atualizado_em        timestamptz not null default now(),
  atualizado_por       uuid        references public.concremtp_usuarios(id)
);

-- ── RLS ──────────────────────────────────────────────────
alter table public.concremtp_permissoes_perfil  enable row level security;
alter table public.concremtp_permissoes_usuario enable row level security;

-- Somente admins lêem/editam concremtp_permissoes_perfil
create policy "admin_permissoes_perfil"
  on public.concremtp_permissoes_perfil for all
  using (
    exists (select 1 from public.concremtp_usuarios
            where id = auth.uid() and nivel = 'administrador')
  );

-- Admins gerenciam concremtp_permissoes_usuario; usuário lê a própria linha
create policy "admin_permissoes_usuario"
  on public.concremtp_permissoes_usuario for all
  using (
    usuario_id = auth.uid() or
    exists (select 1 from public.concremtp_usuarios
            where id = auth.uid() and nivel = 'administrador')
  );

-- ── Dados padrão por perfil ───────────────────────────────
insert into public.concremtp_permissoes_perfil (perfil, permissoes) values

('administrador', '{
  "ver_tabelas": true,
  "ver_canal_fabrica": true,
  "ver_canal_distribuidora": true,
  "ver_canal_dag": true,
  "ver_canal_elo": true,
  "aplicar_reajuste": true,
  "desfazer_reajuste": true,
  "ver_historico_reajustes": true,
  "exportar_historico": true,
  "editar_itens_tabela": true,
  "adicionar_itens_tabela": true,
  "remover_itens_tabela": true,
  "adicionar_colunas_tabela": true,
  "imprimir_pdf": true,
  "gerenciar_usuarios": true,
  "gerenciar_permissoes": true
}'),

('gerente', '{
  "ver_tabelas": true,
  "ver_canal_fabrica": true,
  "ver_canal_distribuidora": true,
  "ver_canal_dag": true,
  "ver_canal_elo": true,
  "aplicar_reajuste": true,
  "desfazer_reajuste": true,
  "ver_historico_reajustes": true,
  "exportar_historico": true,
  "editar_itens_tabela": false,
  "adicionar_itens_tabela": false,
  "remover_itens_tabela": false,
  "adicionar_colunas_tabela": false,
  "imprimir_pdf": true,
  "gerenciar_usuarios": false,
  "gerenciar_permissoes": false
}'),

('vendedor', '{
  "ver_tabelas": true,
  "ver_canal_fabrica": true,
  "ver_canal_distribuidora": true,
  "ver_canal_dag": true,
  "ver_canal_elo": true,
  "aplicar_reajuste": false,
  "desfazer_reajuste": false,
  "ver_historico_reajustes": false,
  "exportar_historico": false,
  "editar_itens_tabela": false,
  "adicionar_itens_tabela": false,
  "remover_itens_tabela": false,
  "adicionar_colunas_tabela": false,
  "imprimir_pdf": true,
  "gerenciar_usuarios": false,
  "gerenciar_permissoes": false
}')

on conflict (perfil) do nothing;
