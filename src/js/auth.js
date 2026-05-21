const _sb = window.supabase.createClient(
  window.__SUPABASE_URL__      || '',
  window.__SUPABASE_ANON_KEY__ || ''
);

window.currentUser  = null;
window.permissoes   = {};
window.temPermissao = (chave) => window.permissoes?.[chave] === true;

const PERMISSOES_PADRAO = {
  administrador: {
    ver_tabelas: true, ver_canal_fabrica: true,
    ver_canal_distribuidora: true, ver_canal_dag: true,
    ver_canal_elo: true, aplicar_reajuste: true,
    desfazer_reajuste: true, ver_historico_reajustes: true,
    exportar_historico: true, editar_itens_tabela: true,
    adicionar_itens_tabela: true, remover_itens_tabela: true,
    adicionar_colunas_tabela: true, imprimir_pdf: true,
    gerenciar_usuarios: true, gerenciar_permissoes: true,
  },
  gerente: {
    ver_tabelas: true, ver_canal_fabrica: true,
    ver_canal_distribuidora: true, ver_canal_dag: true,
    ver_canal_elo: true, aplicar_reajuste: true,
    desfazer_reajuste: true, ver_historico_reajustes: true,
    exportar_historico: true, editar_itens_tabela: false,
    adicionar_itens_tabela: false, remover_itens_tabela: false,
    adicionar_colunas_tabela: false, imprimir_pdf: true,
    gerenciar_usuarios: false, gerenciar_permissoes: false,
  },
  vendedor: {
    ver_tabelas: true, ver_canal_fabrica: true,
    ver_canal_distribuidora: true, ver_canal_dag: true,
    ver_canal_elo: true, aplicar_reajuste: false,
    desfazer_reajuste: false, ver_historico_reajustes: false,
    exportar_historico: false, editar_itens_tabela: false,
    adicionar_itens_tabela: false, remover_itens_tabela: false,
    adicionar_colunas_tabela: false, imprimir_pdf: true,
    gerenciar_usuarios: false, gerenciar_permissoes: false,
  },
};

const ACESSO = {
  administrador: ['portasLacca','portasUV','portasELO','laccaAcab',
    'melamAcab','batenteELO','aplicarReajuste','historicoReajustes',
    'usuarios','permissoes','gerenciarTabelas'],
  gerente: ['portasLacca','portasUV','portasELO','laccaAcab',
    'melamAcab','batenteELO','aplicarReajuste','historicoReajustes'],
  vendedor: ['portasLacca','portasUV','portasELO','laccaAcab',
    'melamAcab','batenteELO'],
};

// ── UI ────────────────────────────────────────────────────

function mostrarLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  const btn = document.getElementById('login-btn');
  if (btn) { btn.disabled = false; btn.textContent = 'Entrar →'; }
  const err = document.getElementById('login-error');
  if (err) err.textContent = '';
}

function ocultarLogin() {
  document.getElementById('login-screen').style.display = 'none';
}

function mostrarErro(msg) {
  const el = document.getElementById('login-error');
  if (el) el.textContent = msg;
  const btn = document.getElementById('login-btn');
  if (btn) { btn.disabled = false; btn.textContent = 'Entrar →'; }
}

function atualizarSidebar(user) {
  const iniciais = user.nome.split(' ')
    .filter(Boolean).map(w => w[0]).slice(0,2).join('').toUpperCase();
  const labels = { administrador:'Administrador', gerente:'Gerente', vendedor:'Vendedor' };
  const av = document.getElementById('sb-user-avatar');
  const nm = document.getElementById('sb-user-name');
  const rl = document.getElementById('sb-user-role');
  if (av) av.textContent = iniciais;
  if (nm) nm.textContent = user.nome;
  if (rl) rl.textContent = labels[user.nivel] || user.nivel;
}

function aplicarAcesso(nivel) {
  const ok = new Set(ACESSO[nivel] || ACESSO.vendedor);
  document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
    btn.style.display = ok.has(btn.dataset.section) ? '' : 'none';
  });
}

function aplicarPermissoes() {
  const p = window.permissoes;
  const map = {
    fabrica:'ver_canal_fabrica', distribuidora:'ver_canal_distribuidora',
    dag:'ver_canal_dag', elo:'ver_canal_elo'
  };
  document.querySelectorAll('.ch-btn').forEach(btn => {
    const k = map[btn.dataset.channel];
    if (k) btn.style.display = p[k] === false ? 'none' : '';
  });
  const pb = document.querySelector('.print-btn');
  if (pb) pb.style.display = p.imprimir_pdf === false ? 'none' : '';
  document.querySelectorAll('.nav-item-usuarios').forEach(b => {
    b.style.display = p.gerenciar_usuarios ? '' : 'none';
  });
  document.querySelectorAll('.nav-item-permissoes').forEach(b => {
    b.style.display = p.gerenciar_permissoes ? '' : 'none';
  });
  document.querySelectorAll('.nav-item-gerenciar-tabelas').forEach(b => {
    b.style.display = p.gerenciar_permissoes ? '' : 'none';
  });
}

// ── INICIAR APP ───────────────────────────────────────────

async function iniciarApp(userId) {
  const { data: perfil, error } = await _sb
    .from('concremtp_usuarios')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !perfil) {
    mostrarErro('Usuário não encontrado. Contate o administrador.');
    await _sb.auth.signOut();
    mostrarLogin();
    return;
  }

  if (!perfil.ativo) {
    mostrarErro('Conta inativa. Contate o administrador.');
    await _sb.auth.signOut();
    mostrarLogin();
    return;
  }

  window.currentUser = {
    id: perfil.id, nome: perfil.nome,
    email: perfil.email, nivel: perfil.nivel
  };

  window.permissoes = { ...(PERMISSOES_PADRAO[perfil.nivel] || PERMISSOES_PADRAO.vendedor) };

  if (typeof rjInitFromSupabase === 'function') await rjInitFromSupabase();

  ocultarLogin();
  atualizarSidebar(window.currentUser);
  aplicarAcesso(perfil.nivel);
  aplicarPermissoes();
  if (typeof initApp === 'function') initApp();
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {

  // Verificar sessão existente
  const { data: { session } } = await _sb.auth.getSession();
  if (session?.user) {
    await iniciarApp(session.user.id);
  } else {
    mostrarLogin();
  }

  // Login
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-password').value;
      const btn   = document.getElementById('login-btn');

      if (!email || !senha) { mostrarErro('Preencha e-mail e senha.'); return; }

      btn.disabled    = true;
      btn.textContent = 'Entrando...';

      const { data, error } = await _sb.auth.signInWithPassword({ email, password: senha });

      if (error) { mostrarErro('E-mail ou senha incorretos.'); return; }

      await iniciarApp(data.user.id);
    });
  }

  // Toggle senha
  document.getElementById('toggle-password')?.addEventListener('click', () => {
    const input = document.getElementById('login-password');
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // Esqueci senha
  document.getElementById('forgot-password')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    if (!email) { mostrarErro('Digite seu e-mail primeiro.'); return; }
    await _sb.auth.resetPasswordForEmail(email);
    mostrarErro('E-mail de recuperação enviado!');
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await _sb.auth.signOut();
    window.currentUser = null;
    window.permissoes  = {};
    mostrarLogin();
  });

  if (typeof setDate === 'function') setDate();
});

// ── NAVEGAÇÃO COM CONTROLE DE ACESSO ─────────────────────

const _origNavigate = window.navigate;
window.navigate = function(btn) {
  if (!window.currentUser) return;
  const sec = btn.dataset.section;
  const ok  = new Set(ACESSO[window.currentUser.nivel] || ACESSO.vendedor);
  if (!ok.has(sec)) { alert('Acesso não autorizado.'); return; }
  _origNavigate(btn);
};

// ── HELPERS GLOBAIS ───────────────────────────────────────

function _esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fecharModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

async function carregarTabelaUsuarios() {
  const { data } = await _sb
    .from('concremtp_usuarios').select('*').order('nome');
  const tbody = document.getElementById('usuarios-tbody');
  if (!tbody || !data) return;
  const badges = {
    administrador: 'badge-adm', gerente: 'badge-ger', vendedor: 'badge-vnd'
  };
  const labels = {
    administrador: 'Administrador', gerente: 'Gerente', vendedor: 'Vendedor'
  };
  tbody.innerHTML = data.map(u => `
    <tr>
      <td>${_esc(u.nome)}</td>
      <td>${_esc(u.email)}</td>
      <td><span class="${badges[u.nivel]||''}">${labels[u.nivel]||u.nivel}</span></td>
      <td>${u.ativo
        ? '<span class="badge-ativo">Ativo</span>'
        : '<span class="badge-inativo">Inativo</span>'}</td>
      <td>${new Date(u.criado_em).toLocaleDateString('pt-BR')}</td>
      <td>
        <button onclick="abrirModalEditar('${u.id}')" class="btn-acao">Editar</button>
        ${u.id !== window.currentUser?.id ? `
        <button onclick="toggleAtivo('${u.id}',${u.ativo})" class="btn-acao btn-acao-danger">
          ${u.ativo ? 'Desativar' : 'Ativar'}
        </button>` : ''}
      </td>
    </tr>`).join('');
}

async function toggleAtivo(id, ativo) {
  if (!confirm(`${ativo ? 'Desativar' : 'Ativar'} este usuário?`)) return;
  await _sb.from('concremtp_usuarios').update({ ativo: !ativo }).eq('id', id);
  carregarTabelaUsuarios();
}

async function salvarNovoUsuario() {
  const nome  = document.getElementById('novo-nome')?.value.trim();
  const email = document.getElementById('novo-email')?.value.trim();
  const nivel = document.getElementById('novo-nivel')?.value;
  const senha = document.getElementById('novo-senha')?.value;
  const errEl = document.getElementById('novo-usuario-erro');

  if (!nome || !email || !senha) {
    if (errEl) errEl.textContent = 'Preencha todos os campos.'; return;
  }
  if (senha.length < 6) {
    if (errEl) errEl.textContent = 'Senha mínima: 6 caracteres.'; return;
  }

  if (errEl) { errEl.style.color = '#718096'; errEl.textContent = 'Criando…'; }

  const { data: authData, error: authErr } = await _sb.auth.signUp({
    email, password: senha, options: { data: { nome, nivel } }
  });

  if (authErr) { if (errEl) errEl.textContent = authErr.message; return; }

  const userId = authData.user?.id;
  if (!userId) {
    if (errEl) errEl.textContent = 'Desative "Email Confirmation" no Supabase Auth.';
    return;
  }

  const { error: dbErr } = await _sb.from('concremtp_usuarios')
    .insert({ id: userId, nome, email, nivel, ativo: true,
              criado_por: window.currentUser?.id });

  if (dbErr) { if (errEl) errEl.textContent = dbErr.message; return; }

  fecharModal('modal-novo-usuario');
  alert(`Usuário criado!\nE-mail: ${email}\nSenha: ${senha}`);
  carregarTabelaUsuarios();
}

async function abrirModalEditar(id) {
  const { data } = await _sb.from('concremtp_usuarios')
    .select('*').eq('id', id).single();
  if (!data) return;
  document.getElementById('editar-id').value    = data.id;
  document.getElementById('editar-nome').value  = data.nome;
  document.getElementById('editar-nivel').value = data.nivel;
  document.getElementById('editar-usuario-erro').textContent = '';
  document.getElementById('modal-editar-usuario').style.display = 'flex';
}

async function salvarEdicaoUsuario() {
  const id    = document.getElementById('editar-id').value;
  const nome  = document.getElementById('editar-nome').value.trim();
  const nivel = document.getElementById('editar-nivel').value;
  const errEl = document.getElementById('editar-usuario-erro');
  if (!nome) { errEl.textContent = 'Nome obrigatório.'; return; }
  const { error } = await _sb.from('concremtp_usuarios')
    .update({ nome, nivel }).eq('id', id);
  if (error) { errEl.textContent = error.message; return; }
  fecharModal('modal-editar-usuario');
  carregarTabelaUsuarios();
  if (id === window.currentUser?.id) {
    window.currentUser.nome  = nome;
    window.currentUser.nivel = nivel;
    atualizarSidebar(window.currentUser);
    aplicarAcesso(nivel);
  }
}
