import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function hashSenha(senha: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(senha)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Cliente com anon key para verificar quem está chamando
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Somente administrador ativo pode trocar a senha de outra pessoa
    const { data: perfil, error: perfilError } = await supabaseClient
      .from('concremtp_usuarios')
      .select('nivel, ativo')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil || perfil.nivel !== 'administrador' || !perfil.ativo) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado — apenas administradores podem alterar a senha de outro usuário' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { usuario_id, nova_senha } = await req.json()

    if (!usuario_id) {
      return new Response(
        JSON.stringify({ error: 'Campo obrigatório: usuario_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!nova_senha || nova_senha.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Senha deve ter ao menos 8 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // A própria senha do admin passa pela função 'alterar-senha'
    if (usuario_id === user.id) {
      return new Response(
        JSON.stringify({ error: 'Use a troca da própria senha para alterar sua conta' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Confere se o alvo existe na tabela de perfis do projeto
    const { data: alvo, error: alvoError } = await supabaseAdmin
      .from('concremtp_usuarios')
      .select('id, email')
      .eq('id', usuario_id)
      .single()

    if (alvoError || !alvo) {
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verifica histórico de senhas do alvo (últimas 5)
    const novoHash = await hashSenha(nova_senha)

    const { data: historico } = await supabaseAdmin
      .from('concremtp_senha_historico')
      .select('senha_hash')
      .eq('usuario_id', usuario_id)
      .order('criado_em', { ascending: false })
      .limit(5)

    const jaUsada = (historico || []).some(h => h.senha_hash === novoHash)
    if (jaUsada) {
      return new Response(
        JSON.stringify({ error: 'Esta senha já foi utilizada anteriormente por este usuário. Escolha uma senha diferente.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Altera a senha do alvo
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      usuario_id,
      { password: nova_senha }
    )

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Salva no histórico do alvo
    await supabaseAdmin
      .from('concremtp_senha_historico')
      .insert({ usuario_id, senha_hash: novoHash })

    return new Response(
      JSON.stringify({ success: true, usuario_id, email: alvo.email }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
