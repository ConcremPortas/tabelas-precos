const _sb = window.supabase.createClient(
  window.__SUPABASE_URL__      || '',
  window.__SUPABASE_ANON_KEY__ || '',
  { auth: { storage: window.sessionStorage, detectSessionInUrl: false } }
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

function _esconderOverload() {
  const ov = document.getElementById('auth-loading');
  if (ov) ov.style.display = 'none';
}

function mostrarLogin() {
  _esconderOverload();
  document.getElementById('login-screen').style.display = 'flex';
  const btn = document.getElementById('login-btn');
  if (btn) { btn.disabled = false; btn.textContent = 'Entrar →'; }
  const err = document.getElementById('login-error');
  if (err) err.textContent = '';
}

function ocultarLogin() {
  _esconderOverload();
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
    .maybeSingle();

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

// ── RENDER DA TELA DE USUÁRIOS ────────────────────────────

function renderUsuarios() {
  if (!window.currentUser || window.currentUser.nivel !== 'administrador') {
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
    <div id="modal-novo-usuario" class="auth-modal-overlay" style="display:none">
      <div class="auth-modal">
        <div class="auth-modal-header">
          <span>Novo Usuário</span>
          <button class="auth-modal-close" onclick="fecharModal('modal-novo-usuario')">✕</button>
        </div>
        <div class="auth-modal-body">
          <label class="form-label">Nome completo<input id="novo-nome" type="text" class="form-input" placeholder="Nome completo"></label>
          <label class="form-label">E-mail<input id="novo-email" type="email" class="form-input" placeholder="email@concrem.com.br"></label>
          <label class="form-label">Nível de acesso
            <select id="novo-nivel" class="form-input">
              <option value="vendedor">Vendedor</option>
              <option value="gerente">Gerente</option>
              <option value="administrador">Administrador</option>
            </select>
          </label>
          <label class="form-label">Senha provisória<input id="novo-senha" type="password" class="form-input" placeholder="Mínimo 6 caracteres"></label>
          <p id="novo-usuario-erro" class="form-error"></p>
        </div>
        <div class="auth-modal-footer">
          <button class="btn-cancelar" onclick="fecharModal('modal-novo-usuario')">Cancelar</button>
          <button class="btn-salvar" onclick="salvarNovoUsuario()">Salvar</button>
        </div>
      </div>
    </div>
    <div id="modal-editar-usuario" class="auth-modal-overlay" style="display:none">
      <div class="auth-modal">
        <div class="auth-modal-header">
          <span>Editar Usuário</span>
          <button class="auth-modal-close" onclick="fecharModal('modal-editar-usuario')">✕</button>
        </div>
        <div class="auth-modal-body">
          <input type="hidden" id="editar-id">
          <label class="form-label">Nome completo<input id="editar-nome" type="text" class="form-input"></label>
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
    </div>
    <div id="modal-alterar-senha" class="auth-modal-overlay" style="display:none">
      <div class="auth-modal">
        <div class="auth-modal-header">
          <span>Alterar Senha</span>
          <button class="auth-modal-close" onclick="fecharModal('modal-alterar-senha')">✕</button>
        </div>
        <div class="auth-modal-body">
          <input type="hidden" id="senha-usuario-id">
          <input type="hidden" id="senha-usuario-email">
          <p id="senha-usuario-info" style="margin-bottom:14px;font-size:13px;color:#6b7280"></p>
          <label class="form-label">Nova senha
            <input id="nova-senha" type="password" class="form-input" placeholder="Mínimo 6 caracteres">
          </label>
          <label class="form-label">Confirmar senha
            <input id="confirmar-senha" type="password" class="form-input" placeholder="Repita a nova senha">
          </label>
          <p id="senha-erro" class="form-error"></p>
        </div>
        <div class="auth-modal-footer">
          <button class="btn-cancelar" onclick="fecharModal('modal-alterar-senha')">Cancelar</button>
          <button class="btn-salvar" onclick="salvarNovaSenha()">Salvar senha</button>
        </div>
      </div>
    </div>`;
}

function abrirModalNovoUsuario() {
  ['novo-nome','novo-email','novo-senha'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const nivel = document.getElementById('novo-nivel');
  if (nivel) nivel.value = 'vendedor';
  const err = document.getElementById('novo-usuario-erro');
  if (err) err.textContent = '';
  document.getElementById('modal-novo-usuario').style.display = 'flex';
}

// Carregar tabela ao navegar para a seção
(function() {
  const _prevAfterRender = typeof window.onAfterRender === 'function' ? window.onAfterRender : null;
  window.onAfterRender = function(section) {
    if (_prevAfterRender) _prevAfterRender(section);
    if (section === 'usuarios') carregarTabelaUsuarios();
  };
})();

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
      <td class="acoes-cell">
        <button onclick="abrirModalEditar('${u.id}')" class="btn-editar-usr">Editar</button>
        <button onclick="abrirModalSenha('${u.id}','${_esc(u.email)}')" class="btn-editar-usr">Senha</button>
        ${u.id !== window.currentUser?.id ? `
        <button onclick="toggleAtivo('${u.id}',${u.ativo})" class="btn-desativar-usr">
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

function _traduzErroAuth(msg) {
  if (!msg) return 'Erro desconhecido.';
  const m = msg.toLowerCase();
  if (m.includes('password should be at least'))      return 'A senha deve ter no mínimo 8 caracteres.';
  if (m.includes('weak') || m.includes('easy to guess')) return 'Senha muito fraca. Use letras, números e símbolos.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Este e-mail já está cadastrado.';
  if (m.includes('user already exists'))              return 'Este e-mail já está cadastrado.';
  if (m.includes('invalid email'))                    return 'E-mail inválido.';
  if (m.includes('unable to validate email'))         return 'E-mail inválido ou não permitido.';
  if (m.includes('signup is disabled'))               return 'Cadastro desabilitado. Contate o administrador.';
  if (m.includes('email not confirmed'))              return 'E-mail não confirmado. Verifique sua caixa de entrada.';
  if (m.includes('invalid login credentials'))        return 'E-mail ou senha incorretos.';
  if (m.includes('too many requests'))                return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  if (m.includes('network') || m.includes('fetch'))  return 'Erro de conexão. Verifique sua internet.';
  if (m.includes('duplicate key') || m.includes('unique'))  return 'Este e-mail já está cadastrado no sistema.';
  return msg; // fallback: retorna original se não mapeado
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

  if (authErr) {
    if (errEl) errEl.textContent = _traduzErroAuth(authErr.message);
    return;
  }

  const userId = authData.user?.id;
  if (!userId) {
    if (errEl) errEl.textContent = 'Desative "Email Confirmation" no Supabase Auth.';
    return;
  }

  const { error: dbErr } = await _sb.from('concremtp_usuarios')
    .insert({ id: userId, nome, email, nivel, ativo: true });

  if (dbErr) { if (errEl) errEl.textContent = _traduzErroAuth(dbErr.message); return; }

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

function abrirModalSenha(userId, email) {
  document.getElementById('senha-usuario-id').value    = userId;
  document.getElementById('senha-usuario-email').value = email;
  document.getElementById('senha-usuario-info').textContent =
    userId === window.currentUser?.id
      ? `Alterando sua própria senha (${email})`
      : `Usuário: ${email}`;
  document.getElementById('nova-senha').value      = '';
  document.getElementById('confirmar-senha').value = '';
  document.getElementById('senha-erro').textContent = '';
  document.getElementById('modal-alterar-senha').style.display = 'flex';
}

async function salvarNovaSenha() {
  const userId = document.getElementById('senha-usuario-id').value;
  const email  = document.getElementById('senha-usuario-email').value;
  const nova   = document.getElementById('nova-senha').value;
  const conf   = document.getElementById('confirmar-senha').value;
  const errEl  = document.getElementById('senha-erro');

  if (!nova)          { errEl.textContent = 'Digite a nova senha.'; return; }
  if (nova.length < 6){ errEl.textContent = 'Senha mínima: 6 caracteres.'; return; }
  if (nova !== conf)  { errEl.textContent = 'As senhas não coincidem.'; return; }

  errEl.style.color = '#718096';
  errEl.textContent = 'Salvando…';

  // Usuário alterando a própria senha
  if (userId === window.currentUser?.id) {
    const { error } = await _sb.auth.updateUser({ password: nova });
    if (error) { errEl.style.color = '#dc2626'; errEl.textContent = _traduzErroAuth(error.message); return; }
    fecharModal('modal-alterar-senha');
    alert('Senha alterada com sucesso!');
    return;
  }

  // Admin alterando senha de outro usuário — envia e-mail de reset
  const { error } = await _sb.auth.resetPasswordForEmail(email);
  if (error) { errEl.style.color = '#dc2626'; errEl.textContent = error.message; return; }
  fecharModal('modal-alterar-senha');
  alert(`E-mail de redefinição de senha enviado para ${email}.\n\nO usuário receberá um link para criar uma nova senha.`);
}
