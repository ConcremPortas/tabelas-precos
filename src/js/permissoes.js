// ── PERMISSÕES UI ────────────────────────────────────────────────────────────
if (typeof DEMO_MODE === 'undefined') var DEMO_MODE = false;

const PERM_LABELS = {
  ver_tabelas:              'Ver tabelas de preços',
  ver_canal_fabrica:        'Ver canal Fábrica',
  ver_canal_distribuidora:  'Ver canal Distribuidora',
  ver_canal_dag:            'Ver canal DAG',
  ver_canal_elo:            'Ver canal ELO',
  aplicar_reajuste:         'Aplicar reajuste de preços',
  desfazer_reajuste:        'Desfazer reajustes',
  ver_historico_reajustes:  'Ver histórico de reajustes',
  exportar_historico:       'Exportar histórico (CSV)',
  editar_itens_tabela:      'Editar itens da tabela',
  adicionar_itens_tabela:   'Adicionar itens à tabela',
  remover_itens_tabela:     'Remover itens da tabela',
  adicionar_colunas_tabela: 'Adicionar colunas à tabela',
  imprimir_pdf:             'Imprimir / exportar PDF',
  gerenciar_usuarios:       'Gerenciar usuários',
  gerenciar_permissoes:     'Gerenciar permissões',
};

const PERM_CATS = {
  'Tabelas':         ['ver_tabelas'],
  'Canais de Venda': ['ver_canal_fabrica','ver_canal_distribuidora','ver_canal_dag','ver_canal_elo'],
  'Reajustes':       ['aplicar_reajuste','desfazer_reajuste','ver_historico_reajustes','exportar_historico'],
  'Edição':          ['editar_itens_tabela','adicionar_itens_tabela','remover_itens_tabela','adicionar_colunas_tabela'],
  'Exportação':      ['imprimir_pdf'],
  'Administração':   ['gerenciar_usuarios','gerenciar_permissoes'],
};

// state
var _permTab    = 'perfil';
var _permPerfil = 'gerente';
var _permUserId = '';
var _permData   = {};   // { gerente: {perms}, vendedor: {perms} }
var _permUsrList = [];  // [{ id, nome, nivel }]
var _permUsrOver = {};  // override atual do usuário selecionado

// ── ENTRY POINT (chamado por auth.js via onAfterRender) ──────────────────────

function renderPermissoes() {
  if (!currentUser || !temPermissao('gerenciar_permissoes')) {
    return '<div class="empty-state"><div class="empty-icon">🔒</div><p class="empty-text">Acesso restrito.</p></div>';
  }
  var tabPerfil  = _permTab === 'perfil'  ? ' active' : '';
  var tabUsuario = _permTab === 'usuario' ? ' active' : '';
  setTimeout(function() { carregarPermissoesUI(); }, 0);
  return '<div class="page-header">'
    + '<div class="page-title">Gerenciamento de Permissões</div>'
    + '<div class="page-meta"><span class="meta-pill">Controle granular de acesso</span></div>'
    + '</div>'
    + '<div class="perm-tabs-bar">'
    + '<button class="perm-tab' + tabPerfil  + '" onclick="permSetTab(\'perfil\')">Por Perfil</button>'
    + '<button class="perm-tab' + tabUsuario + '" onclick="permSetTab(\'usuario\')">Por Usuário</button>'
    + '</div>'
    + '<div id="perm-body"></div>'
    + '<div id="perm-toast" class="perm-toast"></div>';
}

async function carregarPermissoesUI() {
  if (DEMO_MODE) {
    _permData = {
      gerente:  Object.assign({}, PERMISSOES_PADRAO.gerente),
      vendedor: Object.assign({}, PERMISSOES_PADRAO.vendedor),
    };
    _permUsrList = [{ id: DEMO_USER.id, nome: DEMO_USER.nome, nivel: DEMO_USER.nivel }];
  } else {
    try {
      var res = await Promise.all([
        _sb.from('concremtp_permissoes_perfil').select('perfil, permissoes'),
        _sb.from('concremtp_usuarios').select('id, nome, nivel').eq('ativo', true).order('nome'),
      ]);
      _permData = {};
      (res[0].data || []).forEach(function(row) {
        _permData[row.perfil] = Object.assign({}, PERMISSOES_PADRAO[row.perfil] || {}, row.permissoes || {});
      });
      if (!_permData.gerente)  _permData.gerente  = Object.assign({}, PERMISSOES_PADRAO.gerente);
      if (!_permData.vendedor) _permData.vendedor = Object.assign({}, PERMISSOES_PADRAO.vendedor);
      _permUsrList = res[1].data || [];
    } catch(e) {
      _permData    = { gerente: Object.assign({}, PERMISSOES_PADRAO.gerente), vendedor: Object.assign({}, PERMISSOES_PADRAO.vendedor) };
      _permUsrList = [];
    }
  }
  _permRenderBody();
}

function _permRenderBody() {
  var body = document.getElementById('perm-body');
  if (!body) return;
  body.innerHTML = _permTab === 'perfil' ? _htmlPermPerfil() : _htmlPermUsuario();
}

// ── TAB SWITCH ────────────────────────────────────────────────────────────────

function permSetTab(tab) {
  _permTab = tab;
  document.querySelectorAll('.perm-tab').forEach(function(b) {
    b.classList.toggle('active', (tab === 'perfil' && b.textContent === 'Por Perfil') || (tab === 'usuario' && b.textContent === 'Por Usuário'));
  });
  _permRenderBody();
}

// ── POR PERFIL ────────────────────────────────────────────────────────────────

function _htmlPermPerfil() {
  var perms = _permData[_permPerfil] || PERMISSOES_PADRAO[_permPerfil] || {};
  var html = '';

  // perfil selector
  html += '<div class="perm-perfil-selector">';
  ['gerente', 'vendedor'].forEach(function(p) {
    var active = _permPerfil === p ? ' active' : '';
    var label  = p.charAt(0).toUpperCase() + p.slice(1);
    html += '<button class="perm-perfil-btn' + active + '" onclick="permSelectPerfil(\'' + p + '\')">' + label + '</button>';
  });
  html += '</div>';

  if (DEMO_MODE) {
    html += '<div class="perm-demo-notice">Modo demo ativo — alterações ficam apenas na memória. Conecte ao Supabase para persistir.</div>';
  }

  html += '<div class="perm-note">Configurações de base para o perfil <strong>' + _permPerfil + '</strong>.</div>';

  // grid
  html += '<div class="perm-grid">';
  Object.keys(PERM_CATS).forEach(function(cat) {
    var keys = PERM_CATS[cat];
    html += '<div class="perm-cat-block">';
    html += '<div class="perm-cat-title">' + cat + '</div>';
    keys.forEach(function(k) {
      var checked = perms[k] ? ' checked' : '';
      html += '<div class="perm-row">';
      html += '<span class="perm-row-label">' + (PERM_LABELS[k] || k) + '</span>';
      html += '<label class="perm-toggle">';
      html += '<input type="checkbox"' + checked + ' onchange="permTogglePerfil(\'' + k + '\', this.checked)">';
      html += '<span class="perm-toggle-track"></span>';
      html += '</label>';
      html += '</div>';
    });
    html += '</div>';
  });
  html += '</div>';

  // actions
  html += '<div class="perm-actions">';
  html += '<button class="perm-btn-reset" onclick="permResetPerfil()">Restaurar padrões</button>';
  html += '<button class="perm-btn-save"  onclick="permSalvarPerfil()">Salvar alterações</button>';
  html += '</div>';

  return html;
}

function permSelectPerfil(p) {
  _permPerfil = p;
  _permRenderBody();
}

function permTogglePerfil(chave, val) {
  if (!_permData[_permPerfil]) _permData[_permPerfil] = Object.assign({}, PERMISSOES_PADRAO[_permPerfil]);
  _permData[_permPerfil][chave] = val;
}

function permResetPerfil() {
  _permData[_permPerfil] = Object.assign({}, PERMISSOES_PADRAO[_permPerfil]);
  _permRenderBody();
  _permToast('Permissões restauradas para o padrão.');
}

async function permSalvarPerfil() {
  var perms = _permData[_permPerfil];
  if (DEMO_MODE) {
    _permToast('Modo demo — salvo apenas na memória. Conecte ao Supabase para persistir.', true);
    return;
  }
  try {
    var res = await _sb.from('concremtp_permissoes_perfil')
      .update({ permissoes: perms, atualizado_por: currentUser.id })
      .eq('perfil', _permPerfil);
    if (res.error) throw res.error;
    _permToast('Permissões salvas com sucesso!');
  } catch(e) {
    _permToast('Erro ao salvar: ' + ((e && e.message) || e), true);
  }
}

// ── POR USUÁRIO ───────────────────────────────────────────────────────────────

function _htmlPermUsuario() {
  var opts = '';
  _permUsrList.filter(function(u) { return u.nivel !== 'administrador'; }).forEach(function(u) {
    var sel = _permUserId === u.id ? ' selected' : '';
    opts += '<option value="' + u.id + '"' + sel + '>' + _esc(u.nome) + ' (' + u.nivel + ')</option>';
  });

  var html = '<div class="perm-usr-selector">';
  html += '<label class="perm-usr-label">Usuário</label>';
  html += '<select class="perm-usr-select" onchange="permSelectUsuario(this.value)">';
  html += '<option value="">— selecione —</option>' + opts;
  html += '</select></div>';

  if (DEMO_MODE) {
    html += '<div class="perm-demo-notice">Modo demo — alterações ficam apenas na memória.</div>';
  }

  html += '<div id="perm-usr-detail">';
  html += _permUserId ? _htmlPermUsrDetail() : '<div class="perm-empty-select">Selecione um usuário para ver e editar suas permissões individuais.</div>';
  html += '</div>';
  return html;
}

async function permSelectUsuario(id) {
  _permUserId = id;
  _permUsrOver = {};
  var detail = document.getElementById('perm-usr-detail');
  if (!detail) return;
  if (!id) {
    detail.innerHTML = '<div class="perm-empty-select">Selecione um usuário.</div>';
    return;
  }
  if (!DEMO_MODE) {
    try {
      var res = await _sb.from('concremtp_permissoes_usuario').select('permissoes_override').eq('usuario_id', id).single();
      _permUsrOver = (res.data && res.data.permissoes_override) || {};
    } catch(e) { _permUsrOver = {}; }
  }
  detail.innerHTML = _htmlPermUsrDetail();
}

function _htmlPermUsrDetail() {
  var user = _permUsrList.find(function(u) { return u.id === _permUserId; });
  if (!user) return '';
  var base = _permData[user.nivel] || PERMISSOES_PADRAO[user.nivel] || {};
  var efet = Object.assign({}, base, _permUsrOver);

  var html = '<div class="perm-usr-info">';
  html += '<strong>' + _esc(user.nome) + '</strong>';
  html += '<span class="perm-usr-nivel">' + user.nivel + '</span>';
  html += '<span class="perm-usr-hint">Valores que diferem do perfil são marcados como substituição.</span>';
  html += '</div>';

  html += '<div class="perm-grid">';
  Object.keys(PERM_CATS).forEach(function(cat) {
    var keys = PERM_CATS[cat];
    html += '<div class="perm-cat-block">';
    html += '<div class="perm-cat-title">' + cat + '</div>';
    keys.forEach(function(k) {
      var isOv    = _permUsrOver.hasOwnProperty(k);
      var checked = efet[k] ? ' checked' : '';
      var rowCls  = isOv ? ' perm-row-override' : '';
      var badge   = isOv ? ' <span class="perm-override-badge">substituição</span>' : '';
      html += '<div class="perm-row' + rowCls + '">';
      html += '<span class="perm-row-label">' + (PERM_LABELS[k] || k) + badge + '</span>';
      html += '<label class="perm-toggle">';
      html += '<input type="checkbox"' + checked + ' onchange="permToggleUsuario(\'' + k + '\', this.checked)">';
      html += '<span class="perm-toggle-track"></span>';
      html += '</label>';
      html += '</div>';
    });
    html += '</div>';
  });
  html += '</div>';

  html += '<div class="perm-actions">';
  html += '<button class="perm-btn-reset" onclick="permResetUsuario()">Remover substituições</button>';
  html += '<button class="perm-btn-save"  onclick="permSalvarUsuario()">Salvar substituições</button>';
  html += '</div>';
  return html;
}

function permToggleUsuario(chave, val) {
  var user = _permUsrList.find(function(u) { return u.id === _permUserId; });
  if (!user) return;
  var base = _permData[user.nivel] || PERMISSOES_PADRAO[user.nivel] || {};
  if (val === base[chave]) {
    delete _permUsrOver[chave];
  } else {
    _permUsrOver[chave] = val;
  }
  // atualiza visual da linha sem re-render completo
  var allRows = document.querySelectorAll('#perm-usr-detail .perm-row');
  var allKeys = [];
  Object.keys(PERM_CATS).forEach(function(cat) { PERM_CATS[cat].forEach(function(k) { allKeys.push(k); }); });
  allRows.forEach(function(row, i) {
    var k = allKeys[i];
    if (!k) return;
    var isOv = _permUsrOver.hasOwnProperty(k);
    row.classList.toggle('perm-row-override', isOv);
    var lbl   = row.querySelector('.perm-row-label');
    var badge = lbl && lbl.querySelector('.perm-override-badge');
    if (isOv && !badge && lbl) {
      var s = document.createElement('span');
      s.className   = 'perm-override-badge';
      s.textContent = 'substituição';
      lbl.appendChild(s);
    } else if (!isOv && badge) {
      badge.remove();
    }
  });
}

async function permResetUsuario() {
  _permUsrOver = {};
  if (!DEMO_MODE) {
    try {
      await _sb.from('concremtp_permissoes_usuario')
        .upsert({ usuario_id: _permUserId, permissoes_override: null, atualizado_por: currentUser.id }, { onConflict: 'usuario_id' });
    } catch(e) {}
  }
  var detail = document.getElementById('perm-usr-detail');
  if (detail) detail.innerHTML = _htmlPermUsrDetail();
  _permToast('Substituições removidas — usuário usa permissões do perfil.');
}

async function permSalvarUsuario() {
  var override = Object.keys(_permUsrOver).length ? _permUsrOver : null;
  if (DEMO_MODE) {
    _permToast('Modo demo — salvo apenas na memória.', true);
    return;
  }
  try {
    var res = await _sb.from('concremtp_permissoes_usuario')
      .upsert({ usuario_id: _permUserId, permissoes_override: override, atualizado_por: currentUser.id }, { onConflict: 'usuario_id' });
    if (res.error) throw res.error;
    _permToast('Substituições salvas com sucesso!');
  } catch(e) {
    _permToast('Erro ao salvar: ' + ((e && e.message) || e), true);
  }
}

// ── TOAST ─────────────────────────────────────────────────────────────────────

function _permToast(msg, isError) {
  var el = document.getElementById('perm-toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'perm-toast ' + (isError ? 'perm-toast-error' : 'perm-toast-ok') + ' perm-toast-show';
  clearTimeout(el._t);
  el._t = setTimeout(function() { if (el) el.className = 'perm-toast'; }, 3500);
}
