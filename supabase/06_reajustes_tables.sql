-- ============================================================
-- 06 — REAJUSTES DE PREÇOS (migração do localStorage)
-- Rodar DEPOIS de 01, 02, 03, 04 e 05
-- ============================================================

-- ── Histórico de reajustes ────────────────────────────────
create table if not exists public.concremtp_reajustes (
  id               text        primary key,           -- Date.now().toString() do JS
  produto          text        not null,
  canal            text        not null,
  linha            text        not null,
  porcentagem      numeric     not null,
  motivo           text,
  data_hora        timestamptz not null,
  precos_antes     jsonb,                              -- { mult: number }
  sample_antes     numeric,
  linhas_snapshot  jsonb,                              -- snapshot de todas as linhas (quando linha='___all')
  criado_por       uuid        references public.concremtp_usuarios(id) on delete set null
);

create index if not exists idx_concremtp_reajustes_data
  on public.concremtp_reajustes (data_hora desc);

create index if not exists idx_concremtp_reajustes_produto_canal
  on public.concremtp_reajustes (produto, canal);

-- ── Preços atuais (multiplicadores acumulados) ────────────
create table if not exists public.concremtp_precos_atuais (
  chave            text        primary key,            -- ex: "Portas LACCA_fabrica___all"
  mult             numeric     not null default 1,
  atualizado_em    timestamptz not null default now(),
  atualizado_por   uuid        references public.concremtp_usuarios(id) on delete set null
);

-- ── RLS ──────────────────────────────────────────────────
alter table public.concremtp_reajustes     enable row level security;
alter table public.concremtp_precos_atuais enable row level security;

-- Leitura: qualquer usuário autenticado
create policy "reajustes_select"
  on public.concremtp_reajustes for select
  using (auth.uid() is not null);

create policy "precos_atuais_select"
  on public.concremtp_precos_atuais for select
  using (auth.uid() is not null);

-- Escrita de reajuste: admin ou permissão 'aplicar_reajuste'
create policy "reajustes_insert"
  on public.concremtp_reajustes for insert
  with check (
    auth.uid() is not null and (
      exists (
        select 1 from public.concremtp_usuarios
        where id = auth.uid() and nivel = 'administrador'
      )
      or coalesce(
        (select (permissoes_override->>'aplicar_reajuste')::boolean
           from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
        (select (permissoes->>'aplicar_reajuste')::boolean
           from public.concremtp_permissoes_perfil pp
           join public.concremtp_usuarios u on u.nivel = pp.perfil
           where u.id = auth.uid()),
        false
      ) = true
    )
  );

-- Desfazer reajuste: admin ou permissão 'desfazer_reajuste'
create policy "reajustes_delete"
  on public.concremtp_reajustes for delete
  using (
    auth.uid() is not null and (
      exists (
        select 1 from public.concremtp_usuarios
        where id = auth.uid() and nivel = 'administrador'
      )
      or coalesce(
        (select (permissoes_override->>'desfazer_reajuste')::boolean
           from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
        (select (permissoes->>'desfazer_reajuste')::boolean
           from public.concremtp_permissoes_perfil pp
           join public.concremtp_usuarios u on u.nivel = pp.perfil
           where u.id = auth.uid()),
        false
      ) = true
    )
  );

-- Preços atuais INSERT: admin ou aplicar_reajuste
create policy "precos_atuais_insert"
  on public.concremtp_precos_atuais for insert
  with check (
    auth.uid() is not null and (
      exists (
        select 1 from public.concremtp_usuarios
        where id = auth.uid() and nivel = 'administrador'
      )
      or coalesce(
        (select (permissoes_override->>'aplicar_reajuste')::boolean
           from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
        (select (permissoes->>'aplicar_reajuste')::boolean
           from public.concremtp_permissoes_perfil pp
           join public.concremtp_usuarios u on u.nivel = pp.perfil
           where u.id = auth.uid()),
        false
      ) = true
    )
  );

-- Preços atuais UPDATE: admin, aplicar_reajuste ou desfazer_reajuste
create policy "precos_atuais_update"
  on public.concremtp_precos_atuais for update
  using (
    auth.uid() is not null and (
      exists (
        select 1 from public.concremtp_usuarios
        where id = auth.uid() and nivel = 'administrador'
      )
      or coalesce(
        (select (permissoes_override->>'aplicar_reajuste')::boolean
           from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
        (select (permissoes->>'aplicar_reajuste')::boolean
           from public.concremtp_permissoes_perfil pp
           join public.concremtp_usuarios u on u.nivel = pp.perfil
           where u.id = auth.uid()),
        (select (permissoes_override->>'desfazer_reajuste')::boolean
           from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
        false
      ) = true
    )
  );

-- Preços atuais DELETE: admin ou desfazer_reajuste
create policy "precos_atuais_delete"
  on public.concremtp_precos_atuais for delete
  using (
    auth.uid() is not null and (
      exists (
        select 1 from public.concremtp_usuarios
        where id = auth.uid() and nivel = 'administrador'
      )
      or coalesce(
        (select (permissoes_override->>'desfazer_reajuste')::boolean
           from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
        (select (permissoes->>'desfazer_reajuste')::boolean
           from public.concremtp_permissoes_perfil pp
           join public.concremtp_usuarios u on u.nivel = pp.perfil
           where u.id = auth.uid()),
        false
      ) = true
    )
  );
