// ── SUPABASE CONFIG ──────────────────────────────────────────────────────────
// Valores injetados pelo vite.config.js a partir do .env
const SUPABASE_URL      = window.__SUPABASE_URL__      || '';
const SUPABASE_ANON_KEY = window.__SUPABASE_ANON_KEY__ || '';

// Modo demo: ativo quando as credenciais não estão configuradas
const DEMO_MODE = !SUPABASE_URL || !SUPABASE_ANON_KEY;

// Usuário demo pré-cadastrado (desabilitado em produção)
const DEMO_USER = {
  id:    'demo-kaio-melo-001',
  nome:  'Kaio Melo',
  email: 'kaiomelo@concrem.com.br',
  nivel: 'administrador',
  ativo: true,
};
const DEMO_PASSWORD = '1234';
const DEMO_SESSION_KEY = 'concrem_demo_session';

// ── PERMISSÕES PADRÃO POR PERFIL ─────────────────────────────────────────────
const PERMISSOES_PADRAO = {
  administrador: {
    ver_tabelas: true, ver_canal_fabrica: true, ver_canal_distribuidora: true,
    ver_canal_dag: true, ver_canal_elo: true, aplicar_reajuste: true,
    desfazer_reajuste: true, ver_historico_reajustes: true, exportar_historico: true,
    editar_itens_tabela: true, adicionar_itens_tabela: true, remover_itens_tabela: true,
    adicionar_colunas_tabela: true, imprimir_pdf: true, gerenciar_usuarios: true,
    gerenciar_permissoes: true,
  },
  gerente: {
    ver_tabelas: true, ver_canal_fabrica: true, ver_canal_distribuidora: true,
    ver_canal_dag: true, ver_canal_elo: true, aplicar_reajuste: true,
    desfazer_reajuste: true, ver_historico_reajustes: true, exportar_historico: true,
    editar_itens_tabela: false, adicionar_itens_tabela: false, remover_itens_tabela: false,
    adicionar_colunas_tabela: false, imprimir_pdf: true, gerenciar_usuarios: false,
    gerenciar_permissoes: false,
  },
  vendedor: {
    ver_tabelas: true, ver_canal_fabrica: true, ver_canal_distribuidora: true,
    ver_canal_dag: true, ver_canal_elo: true, aplicar_reajuste: false,
    desfazer_reajuste: false, ver_historico_reajustes: false, exportar_historico: false,
    editar_itens_tabela: false, adicionar_itens_tabela: false, remover_itens_tabela: false,
    adicionar_colunas_tabela: false, imprimir_pdf: true, gerenciar_usuarios: false,
    gerenciar_permissoes: false,
  },
};
window.permissoes = {};

let _sb = null;
if (!DEMO_MODE) {
  _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { storage: window.sessionStorage },
  });
}

// ── ESTADO GLOBAL DO USUÁRIO ─────────────────────────────────────────────────
let currentUser = null; // { id, nome, email, nivel }

// ── CONTROLE DE ACESSO ────────────────────────────────────────────────────────
// Seções permitidas por nível
const ACESSO = {
  administrador: ['portasLacca','portasUV','portasELO','laccaAcab','melamAcab','batenteELO','aplicarReajuste','historicoReajustes','usuarios','permissoes','gerenciarTabelas'],
  gerente:       ['portasLacca','portasUV','portasELO','laccaAcab','melamAcab','batenteELO','aplicarReajuste','historicoReajustes'],
  vendedor:      ['portasLacca','portasUV','portasELO','laccaAcab','melamAcab','batenteELO'],
};

function aplicarNivel(nivel) {
  const permitido = new Set(ACESSO[nivel] || ACESSO.vendedor);
  // Mostrar/ocultar itens de navegação
  document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
    btn.style.display = permitido.has(btn.dataset.section) ? '' : 'none';
  });
  // Item Usuários: só administrador vê
  document.querySelectorAll('.nav-item-usuarios').forEach(btn => {
    btn.style.display = nivel === 'administrador' ? '' : 'none';
  });
}

// ── PERMISSÕES: HELPERS ───────────────────────────────────────────────────────
function temPermissao(chave) {
  return window.permissoes?.[chave] === true;
}
window.temPermissao = temPermissao;

async function carregarPermissoes(nivel, userId) {
  const base = { ...(PERMISSOES_PADRAO[nivel] || PERMISSOES_PADRAO.vendedor) };
  if (DEMO_MODE || sessionStorage.getItem(DEMO_SESSION_KEY) === 'ativa') {
    window.permissoes = base;
    return;
  }
  try {
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000));
    const [perfRes, usrRes] = await Promise.race([
      Promise.all([
        _sb.from('concremtp_permissoes_perfil').select('permissoes').eq('perfil', nivel).single(),
        _sb.from('concremtp_permissoes_usuario').select('permissoes_override').eq('usuario_id', userId).single(),
      ]),
      timeout,
    ]);
    const perfPerm    = perfRes.data?.permissoes        || {};
    const usrOverride = usrRes.data?.permissoes_override || {};
    window.permissoes = { ...base, ...perfPerm, ...usrOverride };
  } catch {
    window.permissoes = base;
  }
}

function aplicarPermissoes() {
  const p = window.permissoes;
  // Canais de venda
  const chMap = { fabrica: 'ver_canal_fabrica', distribuidora: 'ver_canal_distribuidora', dag: 'ver_canal_dag', elo: 'ver_canal_elo' };
  document.querySelectorAll('.ch-btn').forEach(btn => {
    const perm = chMap[btn.dataset.channel];
    if (perm) btn.style.display = p[perm] === false ? 'none' : '';
  });
  // Botão imprimir
  const pb = document.querySelector('.print-btn');
  if (pb) pb.style.display = p.imprimir_pdf === false ? 'none' : '';
  // Nav de gestão
  document.querySelectorAll('.nav-item[data-section="aplicarReajuste"]').forEach(b => {
    b.style.display = p.aplicar_reajuste === false ? 'none' : '';
  });
  document.querySelectorAll('.nav-item[data-section="historicoReajustes"]').forEach(b => {
    b.style.display = p.ver_historico_reajustes === false ? 'none' : '';
  });
  document.querySelectorAll('.nav-item-permissoes').forEach(b => {
    b.style.display = p.gerenciar_permissoes ? '' : 'none';
  });
  document.querySelectorAll('.nav-item-usuarios').forEach(b => {
    b.style.display = p.gerenciar_usuarios ? '' : 'none';
  });
}

// Bloqueia acesso via JavaScript, além de ocultar visualmente
const _origNavigate = navigate;
window.navigate = function(btn) {
  if (!currentUser) return;
  const sec = btn.dataset.section;
  const permitido = new Set(ACESSO[currentUser.nivel] || ACESSO.vendedor);
  if (!permitido.has(sec)) {
    alert('Acesso não autorizado para este nível de usuário.');
    return;
  }
  if (sec === 'aplicarReajuste'    && !temPermissao('aplicar_reajuste'))        { alert('Sem permissão para aplicar reajustes.'); return; }
  if (sec === 'historicoReajustes' && !temPermissao('ver_historico_reajustes')) { alert('Sem permissão para ver o histórico.'); return; }
  if (sec === 'usuarios'           && !temPermissao('gerenciar_usuarios'))       { alert('Sem permissão para gerenciar usuários.'); return; }
  if (sec === 'permissoes'         && !temPermissao('gerenciar_permissoes'))     { alert('Sem permissão para gerenciar permissões.'); return; }
  _origNavigate(btn);
};

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function mostrarLogin() {
  document.getElementById('login-screen').style.display = 'flex';
}
function ocultarLogin() {
  document.getElementById('login-screen').style.display = 'none';
}
function mostrarErroLogin(msg, cor) {
  const el = document.getElementById('login-error');
  if (!el) return;
  el.style.color = cor || '#dc2626';
  el.textContent = msg;
}

// ── SIDEBAR — DADOS DO USUÁRIO ────────────────────────────────────────────────
function atualizarSidebarUsuario(user) {
  const iniciais = user.nome
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .slice(0, 2)
    .join('');
  const nivelLabel = { administrador: 'Administrador', gerente: 'Gerente', vendedor: 'Vendedor' };
  const av   = document.getElementById('sb-user-avatar');
  const nome = document.getElementById('sb-user-name');
  const role = document.getElementById('sb-user-role');
  if (av)   av.textContent   = iniciais;
  if (nome) nome.textContent = user.nome;
  if (role) role.textContent = nivelLabel[user.nivel] || user.nivel;
}

// ── BUSCAR PERFIL DO USUÁRIO ──────────────────────────────────────────────────
async function buscarPerfil(userId) {
  if (DEMO_MODE) return DEMO_USER;
  try {
    const result = await Promise.race([
      _sb.from('concremtp_usuarios').select('id, nome, email, nivel, ativo').eq('id', userId).single(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000)),
    ]);
    if (result.error || !result.data) return null;
    return result.data;
  } catch {
    return null;
  }
}

// ── ESTADO DE AUTENTICAÇÃO ────────────────────────────────────────────────────
async function _loginSucesso(perfil) {
  currentUser = { id: perfil.id, nome: perfil.nome, email: perfil.email, nivel: perfil.nivel };
  await carregarPermissoes(currentUser.nivel, currentUser.id);
  if (typeof rjInitFromSupabase === 'function') await rjInitFromSupabase();
  ocultarLogin();
  atualizarSidebarUsuario(currentUser);
  aplicarNivel(currentUser.nivel);
  aplicarPermissoes();
  initApp();
}

// Sessão demo tem prioridade — funciona mesmo com Supabase configurado
const sessaoDemo = sessionStorage.getItem(DEMO_SESSION_KEY);
if (sessaoDemo === 'ativa') {
  (async () => {
    try {
      await _loginSucesso(DEMO_USER);
    } catch (err) {
      sessionStorage.removeItem(DEMO_SESSION_KEY);
      mostrarLogin();
      mostrarErroLogin('Erro ao restaurar sessão: ' + (err && err.message || err));
    }
  })();
} else if (DEMO_MODE) {
  mostrarLogin();
} else {
  let _loginInProgress = false;
  _sb.auth.onAuthStateChange(async (event, session) => {
    // TOKEN_REFRESHED e USER_UPDATED não devem reinicializar o app
    if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return;

    if (session?.user) {
      // Já autenticado ou login em andamento — ignorar disparo duplo
      if (currentUser || _loginInProgress) return;
      _loginInProgress = true;

      try {
        const perfil = await buscarPerfil(session.user.id);
        if (!perfil || !perfil.ativo) {
          await _sb.auth.signOut();
          mostrarLogin();
          mostrarErroLogin('Conta inativa. Contate o administrador.');
          return;
        }
        await _loginSucesso(perfil);
      } catch (err) {
        mostrarLogin();
        mostrarErroLogin('Erro ao inicializar: ' + (err && err.message || err));
      } finally {
        _loginInProgress = false;
      }
    } else {
      _loginInProgress = false;
      mostrarLogin();
      currentUser = null;
    }
  });
}

// ── FORMULÁRIO DE LOGIN ───────────────────────────────────────────────────────
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn      = document.getElementById('login-btn');

  btn.disabled = true;
  btn.innerHTML = '<span class="login-spinner"></span> Entrando…';
  mostrarErroLogin('');

  // Credenciais demo sempre funcionam, independente de o Supabase estar configurado
  if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
    await new Promise(r => setTimeout(r, 400));
    sessionStorage.setItem(DEMO_SESSION_KEY, 'ativa');
    try {
      await _loginSucesso(DEMO_USER);
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = 'Entrar →';
      mostrarErroLogin('Erro ao inicializar: ' + (err && err.message || err));
    }
    return;
  }

  if (DEMO_MODE) {
    // Modo demo sem Supabase: qualquer outra credencial falha
    await new Promise(r => setTimeout(r, 400));
    btn.disabled = false;
    btn.innerHTML = 'Entrar →';
    mostrarErroLogin('E-mail ou senha incorretos.');
    return;
  }

  try {
    const authResult = await Promise.race([
      _sb.auth.signInWithPassword({ email, password }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 10000)),
    ]);
    if (authResult.error) mostrarErroLogin('E-mail ou senha incorretos.');
  } catch (e) {
    mostrarErroLogin(
      e.message === 'timeout'
        ? 'Tempo limite excedido. Verifique sua conexão.'
        : 'Erro de conexão. Tente novamente.'
    );
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Entrar →';
  }
});

// ── MOSTRAR / OCULTAR SENHA ───────────────────────────────────────────────────
document.getElementById('toggle-password').addEventListener('click', () => {
  const inp  = document.getElementById('login-password');
  const icon = document.getElementById('eye-icon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    inp.type = 'password';
    icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
});

// ── RECUPERAR SENHA ───────────────────────────────────────────────────────────
document.getElementById('forgot-password').addEventListener('click', async e => {
  e.preventDefault();
  if (DEMO_MODE) {
    mostrarErroLogin('Modo demo: a senha é "1234".', '#059669');
    return;
  }
  const email = document.getElementById('login-email').value.trim();
  if (!email) { mostrarErroLogin('Digite seu e-mail primeiro.'); return; }
  const { error } = await _sb.auth.resetPasswordForEmail(email);
  if (error) {
    mostrarErroLogin('Erro ao enviar. Verifique o e-mail digitado.');
  } else {
    mostrarErroLogin('E-mail de recuperação enviado! Verifique sua caixa.', '#059669');
  }
});

// ── LOGOUT ────────────────────────────────────────────────────────────────────
document.getElementById('logout-btn').addEventListener('click', async () => {
  sessionStorage.removeItem(DEMO_SESSION_KEY);
  currentUser = null;
  if (!DEMO_MODE && _sb) {
    await _sb.auth.signOut();
    // onAuthStateChange trata mostrarLogin()
  } else {
    mostrarLogin();
  }
});

// ── HOOK PÓS-RENDER ───────────────────────────────────────────────────────────
function onAfterRender(section) {
  if (section === 'usuarios')   carregarTabelaUsuarios();
  if (section === 'permissoes' && typeof carregarPermissoesUI === 'function') carregarPermissoesUI();
}

// ── RENDER — TELA DE USUÁRIOS ─────────────────────────────────────────────────
function renderUsuarios() {
  if (!currentUser || currentUser.nivel !== 'administrador') {
    return '<div class="empty-state"><div class="empty-icon">🔒</div><p class="empty-text">Acesso restrito a administradores.</p></div>';
  }
  return `
    <div class="page-header">
      <div class="page-title">Gerenciamento de Usuários</div>
      <div class="page-meta"><span class="meta-pill">Administração do sistema</span></div>
    </div>
    <div class="usuarios-toolbar">
      <button class="btn-novo-usuario" onclick="abrirModalNovoUsuario()">+ Novo Usuário</button>
    </div>
    <div class="table-card">
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Nome</th><th>E-mail</th><th>Nível</th><th>Status</th><th>Criado em</th><th>Ações</th>
          </tr></thead>
          <tbody id="usuarios-tbody">
            <tr><td colspan="6" style="text-align:center;padding:32px;color:#718096">Carregando…</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    ${_htmlModalNovoUsuario()}
    ${_htmlModalEditarUsuario()}
  `;
}

// ── CARREGAR TABELA DE USUÁRIOS ───────────────────────────────────────────────
async function carregarTabelaUsuarios() {
  const tbody = document.getElementById('usuarios-tbody');
  if (!tbody) return;

  if (DEMO_MODE) {
    tbody.innerHTML = `<tr>
      <td>${_esc(DEMO_USER.nome)}</td>
      <td>${_esc(DEMO_USER.email)}</td>
      <td>${_badgeNivel(DEMO_USER.nivel)}</td>
      <td><span class="badge-ativo">Ativo</span></td>
      <td>—</td>
      <td><em style="color:#9ca3af;font-size:12px">Disponível após vincular o Supabase</em></td>
    </tr>`;
    return;
  }

  const { data, error } = await _sb
    .from('concremtp_usuarios')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error || !data) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#dc2626;padding:24px">Erro ao carregar usuários.</td></tr>';
    return;
  }

  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#718096;padding:24px">Nenhum usuário cadastrado.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(u => `
    <tr>
      <td>${_esc(u.nome)}</td>
      <td>${_esc(u.email)}</td>
      <td>${_badgeNivel(u.nivel)}</td>
      <td>${u.ativo ? '<span class="badge-ativo">Ativo</span>' : '<span class="badge-inativo">Inativo</span>'}</td>
      <td>${u.criado_em ? new Date(u.criado_em).toLocaleDateString('pt-BR') : '—'}</td>
      <td class="acoes-cell">
        <button class="btn-editar-usr" onclick="abrirModalEditar('${u.id}')">Editar</button>
        <button class="btn-desativar-usr" onclick="alternarAtivo('${u.id}', ${u.ativo})"
          ${u.id === currentUser.id ? 'disabled title="Não é possível desativar-se"' : ''}>
          ${u.ativo ? 'Desativar' : 'Ativar'}
        </button>
      </td>
    </tr>
  `).join('');
}

async function alternarAtivo(id, ativoAtual) {
  if (ativoAtual) {
    const { data } = await _sb
      .from('concremtp_usuarios')
      .select('id')
      .eq('nivel', 'administrador')
      .eq('ativo', true);
    if (data?.length === 1 && data[0].id === id) {
      alert('Não é possível desativar o último administrador ativo.');
      return;
    }
  }
  await _sb.from('concremtp_usuarios').update({ ativo: !ativoAtual }).eq('id', id);
  carregarTabelaUsuarios();
}

// ── MODALS ────────────────────────────────────────────────────────────────────
function _htmlModalNovoUsuario() {
  return `
  <div id="modal-novo-usuario" class="auth-modal-overlay" style="display:none">
    <div class="auth-modal">
      <div class="auth-modal-header">
        <span>Novo Usuário</span>
        <button class="auth-modal-close" onclick="fecharModal('modal-novo-usuario')">✕</button>
      </div>
      <div class="auth-modal-body">
        <label class="form-label">Nome completo
          <input id="novo-nome" type="text" class="form-input" placeholder="Nome completo">
        </label>
        <label class="form-label">E-mail
          <input id="novo-email" type="email" class="form-input" placeholder="email@concrem.com.br">
        </label>
        <label class="form-label">Nível de acesso
          <select id="novo-nivel" class="form-input">
            <option value="vendedor">Vendedor</option>
            <option value="gerente">Gerente</option>
            <option value="administrador">Administrador</option>
          </select>
        </label>
        <label class="form-label">Senha provisória
          <input id="novo-senha" type="password" class="form-input" placeholder="Mínimo 6 caracteres">
        </label>
        <p id="novo-usuario-erro" class="form-error"></p>
      </div>
      <div class="auth-modal-footer">
        <button class="btn-cancelar" onclick="fecharModal('modal-novo-usuario')">Cancelar</button>
        <button class="btn-salvar" onclick="salvarNovoUsuario()">Salvar</button>
      </div>
    </div>
  </div>`;
}

function _htmlModalEditarUsuario() {
  return `
  <div id="modal-editar-usuario" class="auth-modal-overlay" style="display:none">
    <div class="auth-modal">
      <div class="auth-modal-header">
        <span>Editar Usuário</span>
        <button class="auth-modal-close" onclick="fecharModal('modal-editar-usuario')">✕</button>
      </div>
      <div class="auth-modal-body">
        <input type="hidden" id="editar-id">
        <label class="form-label">Nome completo
          <input id="editar-nome" type="text" class="form-input">
        </label>
        <label class="form-label">Nível de acesso
          <select id="editar-nivel" class="form-input">
            <option value="vendedor">Vendedor</option>
            <option value="gerente">Gerente</option>
            <option value="administrador">Administrador</option>
          </select>
        </label>
        <p id="editar-usuario-erro" class="form-error"></p>
      </div>
      <div class="auth-modal-footer">
        <button class="btn-cancelar" onclick="fecharModal('modal-editar-usuario')">Cancelar</button>
        <button class="btn-salvar" onclick="salvarEdicaoUsuario()">Salvar alterações</button>
      </div>
    </div>
  </div>`;
}

function abrirModalNovoUsuario() {
  document.getElementById('novo-nome').value   = '';
  document.getElementById('novo-email').value  = '';
  document.getElementById('novo-senha').value  = '';
  document.getElementById('novo-nivel').value  = 'vendedor';
  document.getElementById('novo-usuario-erro').textContent = '';
  document.getElementById('modal-novo-usuario').style.display = 'flex';
}

async function abrirModalEditar(id) {
  const { data } = await _sb.from('concremtp_usuarios').select('*').eq('id', id).single();
  if (!data) return;
  document.getElementById('editar-id').value    = data.id;
  document.getElementById('editar-nome').value  = data.nome;
  document.getElementById('editar-nivel').value = data.nivel;
  document.getElementById('editar-usuario-erro').textContent = '';
  document.getElementById('modal-editar-usuario').style.display = 'flex';
}

function fecharModal(id) {
  document.getElementById(id).style.display = 'none';
}

async function salvarNovoUsuario() {
  const nome  = document.getElementById('novo-nome').value.trim();
  const email = document.getElementById('novo-email').value.trim();
  const nivel = document.getElementById('novo-nivel').value;
  const senha = document.getElementById('novo-senha').value;
  const errEl = document.getElementById('novo-usuario-erro');

  if (!nome || !email || !senha) { errEl.textContent = 'Preencha todos os campos.'; return; }
  if (senha.length < 6)          { errEl.textContent = 'Senha deve ter ao menos 6 caracteres.'; return; }

  errEl.style.color = '#718096';
  errEl.textContent = 'Criando usuário…';

  // Cria o usuário no Supabase Auth
  const { data: authData, error: authErr } = await _sb.auth.signUp({
    email,
    password: senha,
    options: { data: { nome, nivel } }
  });

  if (authErr) { errEl.style.color = '#dc2626'; errEl.textContent = authErr.message; return; }

  const userId = authData.user?.id;
  if (!userId) { errEl.style.color = '#dc2626'; errEl.textContent = 'Erro: usuário não criado.'; return; }

  // Insere na tabela usuarios
  const { error: dbErr } = await _sb.from('concremtp_usuarios').insert({
    id:         userId,
    nome,
    email,
    nivel,
    ativo:      true,
    criado_por: currentUser.id,
  });

  if (dbErr) { errEl.style.color = '#dc2626'; errEl.textContent = dbErr.message; return; }

  fecharModal('modal-novo-usuario');
  alert(`Usuário criado com sucesso!\n\nE-mail: ${email}\nSenha provisória: ${senha}\n\nAnote as credenciais antes de fechar.`);
  carregarTabelaUsuarios();
}

async function salvarEdicaoUsuario() {
  const id    = document.getElementById('editar-id').value;
  const nome  = document.getElementById('editar-nome').value.trim();
  const nivel = document.getElementById('editar-nivel').value;
  const errEl = document.getElementById('editar-usuario-erro');

  if (!nome) { errEl.textContent = 'Nome é obrigatório.'; return; }

  const { error } = await _sb.from('concremtp_usuarios').update({ nome, nivel }).eq('id', id);
  if (error) { errEl.textContent = error.message; return; }

  fecharModal('modal-editar-usuario');
  carregarTabelaUsuarios();
  // Atualiza sidebar se o usuário editou o próprio perfil
  if (id === currentUser.id) {
    currentUser.nome  = nome;
    currentUser.nivel = nivel;
    atualizarSidebarUsuario(currentUser);
    aplicarNivel(nivel);
  }
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
function _esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function _badgeNivel(nivel) {
  const cls = { administrador: 'badge-adm', gerente: 'badge-ger', vendedor: 'badge-vnd' };
  const txt = { administrador: 'Administrador', gerente: 'Gerente', vendedor: 'Vendedor' };
  return `<span class="${cls[nivel] || ''}">${txt[nivel] || nivel}</span>`;
}
