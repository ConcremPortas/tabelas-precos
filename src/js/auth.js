// ── Cloudflare Turnstile ──────────────────────────────────────────────────────
let _turnstileToken = null;

window.onTurnstileSuccess = function(token) {
  _turnstileToken = token;
  const btn = document.getElementById('login-btn');
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = '';
  }
  const status = document.getElementById('turnstile-status');
  if (status) {
    status.textContent = '✓ Verificação concluída';
    status.className = 'turnstile-status verified';
  }
};

window.onTurnstileExpired = function() {
  _turnstileToken = null;
  const btn = document.getElementById('login-btn');
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';
  }
  const status = document.getElementById('turnstile-status');
  if (status) {
    status.textContent = '⟳ Verificação expirada, aguarde...';
    status.className = 'turnstile-status';
  }
};

window.onTurnstileError = function() {
  _turnstileToken = null;
  const status = document.getElementById('turnstile-status');
  if (status) {
    status.textContent = '⚠ Erro na verificação. Recarregue a página.';
    status.className = 'turnstile-status';
    status.style.color = '#dc2626';
  }
};

// ─────────────────────────────────────────────────────────────────────────────
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
    gerenciar_tabelas: true, ver_leroy_merlin: true,
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
    gerenciar_tabelas: false, ver_leroy_merlin: true,
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
    gerenciar_tabelas: false, ver_leroy_merlin: true,
  },
};

const ACESSO = {
  administrador: ['portasLacca','portasUV','portasELO','laccaAcab',
    'melamAcab','batenteELO','aplicarReajuste','historicoReajustes',
    'usuarios','permissoes','gerenciarTabelas','leroyMerlin'],
  gerente: ['portasLacca','portasUV','portasELO','laccaAcab',
    'melamAcab','batenteELO','aplicarReajuste','historicoReajustes','leroyMerlin'],
  vendedor: ['portasLacca','portasUV','portasELO','laccaAcab',
    'melamAcab','batenteELO','leroyMerlin'],
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

function mostrarModalTrocarSenha() {
  const existing = document.getElementById('modal-trocar-senha');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-trocar-senha';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:32px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="margin-bottom:24px;">
        <h2 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">Troca de senha obrigatória</h2>
        <p style="font-size:14px;color:#6b7280;margin:0;">Por segurança, você precisa definir uma nova senha antes de continuar.</p>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:6px;">NOVA SENHA</label>
        <input id="ts-nova-senha" type="password" placeholder="Mínimo 8 caracteres"
          style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;outline:none;">
      </div>
      <div style="margin-bottom:24px;">
        <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:6px;">CONFIRMAR SENHA</label>
        <input id="ts-confirmar-senha" type="password" placeholder="Repita a nova senha"
          style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;outline:none;">
      </div>
      <p id="ts-erro" style="color:#dc2626;font-size:13px;margin:0 0 16px;min-height:18px;"></p>
      <button onclick="confirmarTrocaSenha()"
        style="width:100%;padding:12px;background:#2d6a4f;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;">
        Salvar nova senha
      </button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('ts-nova-senha').focus();
}

async function confirmarTrocaSenha() {
  const nova     = document.getElementById('ts-nova-senha').value;
  const confirma = document.getElementById('ts-confirmar-senha').value;
  const erro     = document.getElementById('ts-erro');

  if (!nova || nova.length < 8) {
    erro.textContent = 'A senha deve ter no mínimo 8 caracteres.';
    return;
  }
  if (nova !== confirma) {
    erro.textContent = 'As senhas não coincidem.';
    return;
  }

  erro.style.color = '#6b7280';
  erro.textContent = 'Salvando...';

  const { data: result, error } = await _sb.functions.invoke('alterar-senha', {
    body: { nova_senha: nova }
  });
  if (error || result?.error) {
    erro.style.color = '#dc2626';
    const msg = (error?.message || result?.error || '');
    if (msg.toLowerCase().includes('weak') || msg.toLowerCase().includes('easy to guess')) {
      erro.textContent = 'Senha muito fraca. Use letras maiúsculas, minúsculas, números e símbolos.';
    } else {
      erro.textContent = msg || 'Erro ao salvar senha.';
    }
    return;
  }

  // Desativa o flag trocar_senha
  await _sb.from('concremtp_usuarios')
    .update({ trocar_senha: false })
    .eq('id', window.currentUser.id);

  document.getElementById('modal-trocar-senha').remove();
  if (typeof initApp === 'function') initApp();
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
    b.style.display = p.gerenciar_tabelas ? '' : 'none';
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

  // Carrega permissões do banco (perfil base + overrides do usuário)
  const { data: permPerfil } = await _sb
    .from('concremtp_permissoes_perfil')
    .select('permissoes')
    .eq('perfil', perfil.nivel)
    .maybeSingle();

  const { data: permUsuario } = await _sb
    .from('concremtp_permissoes_usuario')
    .select('permissoes_override')
    .eq('usuario_id', userId)
    .maybeSingle();

  const basePerms = PERMISSOES_PADRAO[perfil.nivel] || PERMISSOES_PADRAO.vendedor;
  const perfilPerms = (permPerfil && permPerfil.permissoes) || {};
  const userOverride = (permUsuario && permUsuario.permissoes_override) || {};
  window.permissoes = { ...basePerms, ...perfilPerms, ...userOverride };

  if (typeof rjInitFromSupabase === 'function') await rjInitFromSupabase();

  ocultarLogin();
  atualizarSidebar(window.currentUser);
  aplicarAcesso(perfil.nivel);
  aplicarPermissoes();

  // Verificar se precisa trocar senha
  if (perfil.trocar_senha) {
    mostrarModalTrocarSenha();
    return;
  }

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

      if (!email || !senha) { mostrarErro('Preencha e-mail/usuário e senha.'); return; }

      // Verificar token do Turnstile
      if (!_turnstileToken) {
        mostrarErro('Aguarde a verificação de segurança...');
        return;
      }

      btn.disabled    = true;
      btn.textContent = 'Entrando...';

      // Token validado pelo widget do Cloudflare
      if (!_turnstileToken) {
        mostrarErro('Aguarde a verificação de segurança.');
        btn.disabled    = false;
        btn.textContent = 'Entrar →';
        return;
      }

      // Suporte a login por username ou e-mail
      let emailLogin = email;
      if (!email.includes('@')) {
        // Busca o e-mail pelo username
        const { data: userRow } = await _sb
          .from('concremtp_usuarios')
          .select('email')
          .eq('username', email.toLowerCase())
          .eq('ativo', true)
          .maybeSingle();
        if (!userRow) {
          mostrarErro('Usuário não encontrado.');
          btn.disabled = false;
          btn.textContent = 'Entrar →';
          return;
        }
        emailLogin = userRow.email;
      }

      const { data, error } = await _sb.auth.signInWithPassword({ email: emailLogin, password: senha });

      if (error) { mostrarErro('E-mail/usuário ou senha incorretos.'); return; }

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
    let email = document.getElementById('login-email').value.trim();
    if (!email) { mostrarErro('Digite seu e-mail ou usuário primeiro.'); return; }

    // Se for username, busca o e-mail correspondente
    if (!email.includes('@')) {
      const { data: userRow } = await _sb
        .from('concremtp_usuarios')
        .select('email')
        .eq('username', email.toLowerCase())
        .eq('ativo', true)
        .maybeSingle();
      if (!userRow) { mostrarErro('Usuário não encontrado.'); return; }
      email = userRow.email;
    }

    const { error } = await _sb.auth.resetPasswordForEmail(email);
    if (error) { mostrarErro('Erro ao enviar e-mail. Tente novamente.'); return; }
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
          <label class="form-label">Nome de usuário (opcional)<input id="novo-username" type="text" class="form-input" placeholder="ex: kaio (para e-mails compartilhados)" autocomplete="off"></label>
          <label class="form-label">Nível de acesso
            <select id="novo-nivel" class="form-input">
              <option value="vendedor">Vendedor</option>
              <option value="gerente">Gerente</option>
              <option value="administrador">Administrador</option>
            </select>
          </label>
          <label class="form-label">Senha provisória<input id="novo-senha" type="password" class="form-input" placeholder="Mínimo 6 caracteres" autocomplete="new-password"></label>
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
  ['novo-nome','novo-email','novo-username','novo-senha'].forEach(id => {
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
  const nome     = document.getElementById('novo-nome')?.value.trim();
  const email    = document.getElementById('novo-email')?.value.trim();
  const nivel    = document.getElementById('novo-nivel')?.value;
  const senha    = document.getElementById('novo-senha')?.value;
  const username = document.getElementById('novo-username')?.value.trim().toLowerCase() || null;
  const errEl = document.getElementById('novo-usuario-erro');

  if (!nome || !email || !senha) {
    if (errEl) errEl.textContent = 'Preencha todos os campos.';
    return;
  }
  if (senha.length < 6) {
    if (errEl) errEl.textContent = 'Senha mínima: 6 caracteres.';
    return;
  }

  if (errEl) { errEl.style.color = '#718096'; errEl.textContent = 'Criando usuário…'; }

  try {
    const { data, error } = await _sb.functions.invoke('criar-usuario', {
      body: { nome, email, senha, nivel, username, trocar_senha: true }
    });

    if (error) {
      if (errEl) errEl.textContent = error.message || 'Erro ao criar usuário.';
      return;
    }

    if (data?.error) {
      if (errEl) errEl.textContent = data.error;
      return;
    }

    fecharModal('modal-novo-usuario');
    alert('Usuário criado com sucesso!\nE-mail: ' + email + '\nSenha: ' + senha);
    carregarTabelaUsuarios();

  } catch (e) {
    if (errEl) errEl.textContent = 'Erro inesperado: ' + e.message;
  }
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
