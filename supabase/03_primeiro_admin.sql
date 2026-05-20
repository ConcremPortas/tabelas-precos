-- ============================================================
-- 03 — CADASTRAR O PRIMEIRO ADMINISTRADOR (Kaio Melo)
-- Rodar DEPOIS de 01 e 02
--
-- PASSO 1: Crie o usuário no Supabase Auth
--   → Acesse: Authentication > Users > Add user
--   → E-mail:  kaiomelo@concrem.com.br
--   → Senha:   (defina a senha real aqui — não usar "1234" em produção)
--   → Marque "Auto Confirm User"
--
-- PASSO 2: Copie o UUID gerado pelo Supabase Auth e substitua abaixo
--
-- PASSO 3: Rode este script no SQL Editor
-- ============================================================

insert into public.concremtp_usuarios (id, nome, email, nivel, ativo)
values (
  'COLE-AQUI-O-UUID-DO-AUTH-USER',   -- substitua pelo uuid real
  'Kaio Melo',
  'kaiomelo@concrem.com.br',
  'administrador',
  true
)
on conflict (id) do nothing;

-- Verificar se foi inserido corretamente:
-- select * from public.concremtp_usuarios;
