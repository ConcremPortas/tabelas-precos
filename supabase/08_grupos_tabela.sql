-- ============================================================
-- 08 — GRUPOS DAS TABELAS (grupos/coleções criados pelo usuário)
-- Rodar DEPOIS de 01–07
-- ============================================================

create table if not exists public.concremtp_grupos_tabela (
  id             uuid        primary key default gen_random_uuid(),
  produto        text        not null,
  canal          text        not null,
  nome           text        not null,
  descricao      text,
  cor_cabecalho  text        not null default '#1a3a1a',
  ordem          integer     not null default 999,
  ativo          boolean     not null default true,
  criado_em      timestamptz not null default now(),
  criado_por     uuid        references public.concremtp_usuarios(id) on delete set null
);

create index if not exists idx_concremtp_grupos_produto_canal
  on public.concremtp_grupos_tabela (produto, canal);

alter table public.concremtp_grupos_tabela enable row level security;

-- Leitura: qualquer autenticado pode ver grupos ativos
create policy "grupos_tabela_select"
  on public.concremtp_grupos_tabela for select
  using (auth.uid() is not null);

-- Escrita: somente administrador
create policy "grupos_tabela_insert"
  on public.concremtp_grupos_tabela for insert
  with check (
    exists (
      select 1 from public.concremtp_usuarios
      where id = auth.uid() and nivel = 'administrador'
    )
  );

create policy "grupos_tabela_update"
  on public.concremtp_grupos_tabela for update
  using (
    exists (
      select 1 from public.concremtp_usuarios
      where id = auth.uid() and nivel = 'administrador'
    )
  );

create policy "grupos_tabela_delete"
  on public.concremtp_grupos_tabela for delete
  using (
    exists (
      select 1 from public.concremtp_usuarios
      where id = auth.uid() and nivel = 'administrador'
    )
  );
