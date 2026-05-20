-- ============================================================
-- 05 — TABELA DE ITENS CUSTOMIZADOS (gerenciador de tabelas)
-- Rodar DEPOIS de 01, 02, 03 e 04
-- ============================================================

-- ── Tabela: concremtp_itens_tabela ────────────────────────
create table if not exists public.concremtp_itens_tabela (
  id             uuid        primary key default gen_random_uuid(),
  produto        text        not null,   -- 'portasLacca', 'portasUV', 'portasELO', 'laccaAcab', 'melamAcab', 'batenteELO'
  canal          text        not null,   -- 'fabrica', 'distribuidora', 'dag', 'elo'
  colecao        text,                   -- nome da coleção (porta) ou variante alizar ('alizar9'|'alizar15')
  linha          text,                   -- nome da linha (porta) ou label do grupo (batente/alizar/rodapé)
  acabamento     text        not null,   -- grupo.nome (porta) ou item.acab (batente) ou item name (adicional)
  larguras       jsonb       not null default '{}',  -- {"60": 176.49, "70": 202.30, ...}
  preco_venda    numeric,                -- batente / alizar / adicional / ferragem
  preco_protect  numeric,                -- batente / alizar com Protect+
  preco_regua    numeric,                -- rodapé régua 2,40m
  preco_ml       numeric,                -- rodapé metro linear
  tipo           text        not null    -- 'porta', 'batente', 'alizar', 'rodape', 'adicional', 'ferragem'
                             check (tipo in ('porta','batente','alizar','rodape','adicional','ferragem')),
  ativo          boolean     not null default true,
  criado_em      timestamptz not null default now(),
  criado_por     uuid        references public.concremtp_usuarios(id),
  editado_em     timestamptz,
  editado_por    uuid        references public.concremtp_usuarios(id)
);

-- Índices para lookup rápido
create index if not exists idx_concremtp_itens_lookup
  on public.concremtp_itens_tabela (produto, canal, tipo, ativo);

create index if not exists idx_concremtp_itens_acabamento
  on public.concremtp_itens_tabela (produto, canal, acabamento) where ativo = true;

-- ── RLS ──────────────────────────────────────────────────
alter table public.concremtp_itens_tabela enable row level security;

-- Todos os autenticados lêem itens ativos
create policy "itens_tabela_select"
  on public.concremtp_itens_tabela for select
  using (
    ativo = true
    and auth.uid() is not null
  );

-- INSERT: precisa de permissao 'adicionar_itens_tabela'
create policy "itens_tabela_insert"
  on public.concremtp_itens_tabela for insert
  with check (
    auth.uid() is not null
    and (
      -- administrador sempre pode
      exists (select 1 from public.concremtp_usuarios where id = auth.uid() and nivel = 'administrador')
      or
      -- ou tem permissão granular
      (
        coalesce(
          (select (permissoes_override->>'adicionar_itens_tabela')::boolean
           from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
          (select (permissoes->>'adicionar_itens_tabela')::boolean
           from public.concremtp_permissoes_perfil pp
           join public.concremtp_usuarios u on u.nivel = pp.perfil
           where u.id = auth.uid()),
          false
        ) = true
      )
    )
  );

-- UPDATE (editar e soft-delete): precisa de 'editar_itens_tabela' ou 'remover_itens_tabela'
create policy "itens_tabela_update"
  on public.concremtp_itens_tabela for update
  using (
    auth.uid() is not null
    and (
      exists (select 1 from public.concremtp_usuarios where id = auth.uid() and nivel = 'administrador')
      or
      coalesce(
        (select (permissoes_override->>'editar_itens_tabela')::boolean
         from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
        (select (permissoes->>'editar_itens_tabela')::boolean
         from public.concremtp_permissoes_perfil pp
         join public.concremtp_usuarios u on u.nivel = pp.perfil
         where u.id = auth.uid()),
        false
      ) = true
      or
      coalesce(
        (select (permissoes_override->>'remover_itens_tabela')::boolean
         from public.concremtp_permissoes_usuario where usuario_id = auth.uid()),
        (select (permissoes->>'remover_itens_tabela')::boolean
         from public.concremtp_permissoes_perfil pp
         join public.concremtp_usuarios u on u.nivel = pp.perfil
         where u.id = auth.uid()),
        false
      ) = true
    )
  );
