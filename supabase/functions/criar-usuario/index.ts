import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS })
  }

  // Verificar se o chamador está autenticado
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS }
    })
  }

  // Cliente com anon key para verificar o usuário chamador
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  // Verificar se o chamador está autenticado
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS }
    })
  }

  // Verificar se o chamador é administrador ativo
  const { data: perfil } = await supabaseClient
    .from('concremtp_usuarios')
    .select('nivel, ativo')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.nivel !== 'administrador' || !perfil.ativo) {
    return new Response(JSON.stringify({ error: 'Acesso negado' }), {
      status: 403, headers: { 'Content-Type': 'application/json', ...CORS }
    })
  }

  // Cliente admin com service_role (nunca exposto ao frontend)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { nome, email, senha, nivel } = await req.json()

  if (!nome || !email || !senha || !nivel) {
    return new Response(JSON.stringify({ error: 'Campos obrigatórios: nome, email, senha, nivel' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS }
    })
  }

  // Criar usuário no Auth (já confirmado — sem e-mail de verificação)
  const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  })

  if (authErr) {
    return new Response(JSON.stringify({ error: authErr.message }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS }
    })
  }

  // Inserir perfil na tabela de usuários
  const { error: dbErr } = await supabaseAdmin
    .from('concremtp_usuarios')
    .insert({
      id: authData.user.id,
      nome,
      email,
      nivel,
      ativo: true,
      criado_por: user.id,
    })

  if (dbErr) {
    // Rollback: remove do Auth se falhou no banco
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return new Response(JSON.stringify({ error: dbErr.message }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS }
    })
  }

  return new Response(
    JSON.stringify({ success: true, id: authData.user.id }),
    { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } }
  )
})
