-- ============================================================
-- 01 — TABELA DE USUÁRIOS
-- Rodar PRIMEIRO no SQL Editor do Supabase
-- ============================================================

create table if not exists public.concremtp_usuarios (
  id         uuid        primary key references auth.users(id) on delete cascade,
  nome       text        not null,
  email      text        not null unique,
  nivel      text        not null default 'vendedor'
                         check (nivel in ('administrador', 'gerente', 'vendedor')),
  ativo      boolean     not null default true,
  criado_em  timestamptz not null default now(),
  criado_por uuid        references public.concremtp_usuarios(id)
);

comment on table public.concremtp_usuarios is
  'Perfis de usuário vinculados ao Supabase Auth (auth.users).';

comment on column public.concremtp_usuarios.nivel is
  'Nível de acesso: administrador | gerente | vendedor';
