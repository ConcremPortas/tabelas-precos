-- Insere o administrador principal na tabela de usuários.
-- Execute este SQL UMA VEZ após configurar o projeto no Supabase.
-- O usuário já deve existir em auth.users (cadastrado via Supabase Auth).

INSERT INTO public.concremtp_usuarios (id, nome, email, nivel, ativo)
VALUES (
  '5f5ba828-e3ac-475d-8bec-ce87ea3bf04d',
  'Kaio Melo',
  'kaiomelo@concrem.com.br',
  'administrador',
  true
)
ON CONFLICT (id) DO UPDATE SET
  nome  = EXCLUDED.nome,
  nivel = EXCLUDED.nivel,
  ativo = EXCLUDED.ativo;
