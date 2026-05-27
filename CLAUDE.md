# CLAUDE.md — App Tabelas Comerciais CONCREM

Referência completa para desenvolvedores e IAs que trabalhem neste projeto.
Leia antes de qualquer alteração.

---

## 1. Visão Geral do Projeto

App web de tabelas de preços comerciais da CONCREM (fabricante de portas e acabamentos).
Substitui a planilha `TABELAS_COMERCIAL.xlsx`. Acesso restrito por login com controle
de permissões granular por nível de usuário.

**Funcionalidades principais:**
- Visualização de tabelas de preços por produto e canal de venda
- Sistema de reajuste de preços com histórico e desfazer
- Gestão de itens das tabelas (CRUD via gerenciador)
- Canal especial Leroy Merlin com estrutura própria
- Impressão em PDF por seção
- Gerenciamento de usuários e permissões (somente administrador)
- Troca de senha obrigatória no primeiro login

---

## 2. Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML5 + CSS3 + JavaScript puro (vanilla JS, sem frameworks) |
| Build | Vite (apenas para injeção de variáveis `.env` e bundle) |
| Autenticação | Supabase Auth (email/password + suporte a username) |
| Banco de dados | Supabase (PostgreSQL) |
| Edge Functions | Deno/TypeScript no Supabase |
| Proteção de login | Cloudflare Turnstile (modo Managed) |
| Deploy frontend | Vercel |
| Fontes externas | Google Fonts (Inter, DM Mono), Tabler Icons (local) |

**Dependências de runtime (CDN):**
- `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` — Supabase JS SDK
- `https://challenges.cloudflare.com/turnstile/v0/api.js` — Turnstile widget

---

## 3. Estrutura de Arquivos

```
index.html                        ← HTML principal + carregamento de scripts
vercel.json                       ← headers de segurança e config de deploy
package.json                      ← scripts: dev, build, preview
vite.config.js                    ← injeção de variáveis de ambiente
build-post.cjs                    ← pós-processamento do build
.env                              ← VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (nunca commitar)
CLAUDE.md                         ← este arquivo

Logos/
  concrem-logo.png
  concrem-logo-mini.png
  Isotipo-Cores.png
  concrem-fav.ico

src/
  css/
    styles.css                    ← todo o CSS (variáveis, layout, sidebar, tabelas, modal, print, custom-select)
  fonts/
    tabler/                       ← ícones Tabler (local, sem CDN)
  js/
    data.js                       ← dados das tabelas e variáveis de estado global
    render.js                     ← funções de renderização e navegação
    reajuste.js                   ← sistema de reajuste com histórico e desfazer
    auth.js                       ← autenticação, permissões, gestão de usuários
    permissoes.js                 ← tela de gerenciamento de permissões por perfil/usuário
    gerenciador.js                ← CRUD de itens das tabelas (gerenciar.js)
    gerenciar-tabelas.js          ← UI do gerenciador de tabelas
    leroymerlin.js                ← renderização do canal Leroy Merlin
    microinteractions.js          ← animações e feedback visual
    custom-select.js              ← componente de select customizado com busca

supabase/
  functions/
    criar-usuario/index.ts        ← cria usuário no Auth + tabela (requer admin)
    alterar-senha/index.ts        ← altera senha via service_role + histórico de hashes
    excluir-usuario/index.ts      ← exclui do Auth + tabela (requer admin)
    verificar-turnstile/index.ts  ← valida token Turnstile na Cloudflare (--no-verify-jwt)
```

**Ordem obrigatória de carregamento dos scripts:**
1. `data.js` — define dados e estado global
2. `render.js` — usa dados, define `render()` e funções de UI
3. `reajuste.js` — intercepta `render()`, usa dados e funções de render
4. `auth.js` — autenticação, chama `initApp()` após login
5. `permissoes.js` — tela de permissões
6. `gerenciador.js` — CRUD de itens
7. `gerenciar-tabelas.js` — UI do gerenciador
8. `leroymerlin.js` — canal Leroy Merlin
9. `microinteractions.js` — animações
10. `custom-select.js` — selects customizados (último, inicializa todos os selects)

---

## 4. Padrões de Segurança Obrigatórios

### Autenticação e login
- Login aceita **e-mail** ou **username** (campo `username` na tabela `concremtp_usuarios`)
- Se o campo não contém `@`, busca o e-mail correspondente via `username`
- **Cloudflare Turnstile obrigatório**: botão "Entrar" fica desabilitado até `onTurnstileSuccess` ser chamado
- Site Key pública: `0x4AAAAAADWNyGIWAgcMsRkn` (pode ficar no frontend)
- Secret Key: **somente** no Supabase Secret `TURNSTILE_SECRET_KEY` (jamais no frontend)
- A função `verificar-turnstile` deve ser deployada com `--no-verify-jwt` (chamada antes do login)

### Senhas
- Mínimo **8 caracteres** (validado no frontend e na Edge Function)
- **Bloqueio das últimas 5 senhas** usadas (tabela `concremtp_senha_historico`, comparação via SHA-256)
- Troca de senha obrigatória controlada pelo campo `trocar_senha BOOLEAN` na tabela de usuários
- Administrador pode ativar/desativar a obrigatoriedade individualmente por usuário

### Chaves e secrets
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` → somente no `.env` (Vite injeta no build)
- `SUPABASE_SERVICE_ROLE_KEY` → somente nas Edge Functions via `Deno.env.get()`
- **Nunca** expor `service_role` key no código frontend, mesmo que ofuscado

### RLS (Row Level Security)
- Todas as tabelas do projeto devem ter RLS habilitado
- Políticas por nível: administrador vê tudo; gerente e vendedor veem apenas o necessário
- Operações de escrita sensíveis (criar/excluir usuário, alterar senha de outro) devem
  passar por Edge Functions com `service_role`, nunca direto do frontend

---

## 5. Padrões de Edge Functions

### Estrutura padrão

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verificar Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return erro(401, 'Não autorizado')

    // 2. Verificar identidade com anon key (nunca pular este passo)
    const supabaseClient = createClient(URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) return erro(401, 'Não autorizado')

    // 3. Verificar permissão se necessário
    // ...

    // 4. Operação privilegiada com service_role
    const supabaseAdmin = createClient(URL, SERVICE_ROLE_KEY)
    // ...

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

### Regras
- **Sempre** incluir `x-client-info` no `corsHeaders`
- **Sempre** verificar autenticação via `anon key` antes de usar `service_role`
- Funções públicas (sem login): usar `--no-verify-jwt` no deploy
- Funções privadas: JWT é verificado automaticamente pelo Supabase

---

## 6. Padrões de Banco de Dados

### Prefixo de tabelas
Todas as tabelas do projeto usam o prefixo `concremtp_`:

| Tabela | Finalidade |
|--------|-----------|
| `concremtp_usuarios` | Perfis de usuários (id, nome, email, username, nivel, ativo, trocar_senha) |
| `concremtp_permissoes_perfil` | Permissões padrão por nível (administrador/gerente/vendedor) |
| `concremtp_permissoes_usuario` | Overrides individuais de permissão por usuário |
| `concremtp_reajustes` | Histórico de reajustes de preços |
| `concremtp_audit_tabelas` | Auditoria de alterações nas tabelas |
| `concremtp_senha_historico` | Hashes SHA-256 das últimas senhas (evitar reuso) |

### Convenções SQL
```sql
-- Chave primária
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- Timestamps
criado_em  TIMESTAMPTZ DEFAULT NOW()
atualizado_em TIMESTAMPTZ DEFAULT NOW()

-- Foreign keys com cascade
usuario_id UUID REFERENCES concremtp_usuarios(id) ON DELETE CASCADE

-- UNIQUE onde necessário
username TEXT UNIQUE
email TEXT UNIQUE
```

---

## 7. Padrões de Permissões

### Três níveis de acesso

| Nível | Descrição |
|-------|-----------|
| `administrador` | Acesso total — gerencia usuários, permissões e tabelas |
| `gerente` | Visualiza tudo, aplica reajustes, não edita itens nem gerencia usuários |
| `vendedor` | Somente visualização das tabelas e canais autorizados |

### Como funciona o carregamento

1. `iniciarApp()` carrega permissões do banco em três camadas:
   - `PERMISSOES_PADRAO[nivel]` — fallback hardcoded no frontend
   - `concremtp_permissoes_perfil` — override por nível (editável pelo admin)
   - `concremtp_permissoes_usuario` — override individual por usuário
2. Resultado final: `window.permissoes = { ...base, ...perfilPerms, ...userOverride }`
3. `aplicarPermissoes()` mostra/oculta elementos da UI com base em `window.permissoes`

### Chaves de permissão disponíveis
```
ver_tabelas, ver_canal_fabrica, ver_canal_distribuidora, ver_canal_dag,
ver_canal_elo, ver_leroy_merlin, aplicar_reajuste, desfazer_reajuste,
ver_historico_reajustes, exportar_historico, editar_itens_tabela,
adicionar_itens_tabela, remover_itens_tabela, adicionar_colunas_tabela,
imprimir_pdf, gerenciar_usuarios, gerenciar_permissoes, gerenciar_tabelas
```

### Regra para novas permissões
Ao adicionar uma nova permissão:
1. Adicionar em `PERMISSOES_PADRAO` nos três perfis em `auth.js`
2. Adicionar em `PERM_LABELS` em `permissoes.js`
3. Adicionar na categoria correta em `PERM_CATS` em `permissoes.js`
4. Usar `temPermissao('chave')` no frontend para verificar

---

## 8. Padrões de Deploy

### Frontend — Vercel
- Build: `npm run build` → output em `dist/`
- Variáveis de ambiente obrigatórias no painel da Vercel:
  ```
  VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  ```
- `vercel.json` configura headers de segurança para todas as rotas:
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy` — inclui todos os domínios necessários

### CSP atual — domínios permitidos
| Diretiva | Domínios |
|----------|---------|
| `script-src` | `cdn.jsdelivr.net`, `fonts.googleapis.com`, `challenges.cloudflare.com` |
| `style-src` | `fonts.googleapis.com`, `fonts.gstatic.com`, `challenges.cloudflare.com` |
| `connect-src` | `*.supabase.co`, `challenges.cloudflare.com`, `cdn.jsdelivr.net` |
| `frame-src` | `challenges.cloudflare.com` |
| `worker-src` | `blob:` |

**Ao adicionar novos scripts ou iframes externos, atualizar `vercel.json` antes do deploy.**

### Edge Functions — Supabase
- Projeto: `tydjxesipmbtxsceeaav`
- Deploy padrão (com JWT):
  ```bash
  supabase functions deploy <nome> --project-ref tydjxesipmbtxsceeaav
  ```
- Deploy sem JWT (funções públicas):
  ```bash
  supabase functions deploy verificar-turnstile --project-ref tydjxesipmbtxsceeaav --no-verify-jwt
  ```

### Cloudflare Turnstile
- Hostname do site deve estar cadastrado no painel da Cloudflare
- Site Key (pública): no `index.html` em `data-sitekey`
- Secret Key: configurada como Supabase Secret:
  ```bash
  supabase secrets set TURNSTILE_SECRET_KEY=0x4... --project-ref tydjxesipmbtxsceeaav
  ```

---

## 9. Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Deploy de Edge Function (com JWT)
supabase functions deploy <nome> --project-ref tydjxesipmbtxsceeaav

# Deploy de Edge Function (sem JWT — funções públicas)
supabase functions deploy verificar-turnstile --project-ref tydjxesipmbtxsceeaav --no-verify-jwt

# Configurar secret
supabase secrets set CHAVE=valor --project-ref tydjxesipmbtxsceeaav

# Listar secrets configurados
supabase secrets list --project-ref tydjxesipmbtxsceeaav

# Ver logs de Edge Function
supabase functions logs <nome> --project-ref tydjxesipmbtxsceeaav
```

---

## 10. O Que NUNCA Fazer (Anti-patterns)

### Frontend
- **Nunca** usar frameworks CSS (Bootstrap, Tailwind) ou JS (jQuery, React, Vue)
- **Nunca** expor `SUPABASE_SERVICE_ROLE_KEY` em nenhum arquivo do frontend
- **Nunca** sobrescrever dados originais de preço em memória — acréscimos e reajustes
  são calculados na exibição, os dados base permanecem intocados
- **Nunca** inventar dados de preço — usar apenas os valores fornecidos explicitamente
- **Nunca** misturar responsabilidades entre arquivos JS (dados em `data.js`,
  render em `render.js`, reajuste em `reajuste.js`)

### Segurança
- **Nunca** chamar `service_role` diretamente do frontend
- **Nunca** pular a verificação de identidade (`auth.getUser()`) antes de operações privilegiadas
- **Nunca** remover o Turnstile do fluxo de login sem autorização explícita
- **Nunca** armazenar senhas em texto plano — usar sempre hash SHA-256 no histórico
- **Nunca** permitir que um usuário exclua ou altere a própria conta via Edge Function
  (validar `usuario_id !== user.id`)

### Deploy
- **Nunca** commitar o arquivo `.env`
- **Nunca** usar `--no-verify-jwt` em funções que requerem usuário autenticado
- **Nunca** adicionar novo domínio externo (script, iframe, fonte) sem atualizar
  o `Content-Security-Policy` no `vercel.json`
- **Nunca** alterar a ordem de carregamento dos scripts em `index.html`
  sem verificar dependências entre eles

### Banco de dados
- **Nunca** criar tabelas sem o prefixo `concremtp_`
- **Nunca** desabilitar RLS em tabelas de produção
- **Nunca** usar `ON DELETE SET NULL` em foreign keys críticas — prefer `CASCADE`
  ou proteger no nível da aplicação
