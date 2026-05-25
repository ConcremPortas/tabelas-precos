// ── LEROY MERLIN ─────────────────────────────────────────────────────────────
if (typeof DEMO_MODE === 'undefined') var DEMO_MODE = false;
if (typeof onAfterRender === 'undefined') window.onAfterRender = function() {};

var _lmData        = [];
var _lmFiltroTipo  = '';
var _lmFiltroModelo = '';
var _lmFiltroLocal = '';
var _lmFiltroLinha = '';

// ── RENDER ESQUELETO ──────────────────────────────────────────────────────────

function renderLeroyMerlin() {
  return '<div class="page-header">'
    + '<div class="page-title">Tabela Leroy Merlin</div>'
    + '<div class="page-meta">'
    + 'Preços CIF — atualizado em fev/2026 '
    + '<span class="lm-canal-badge">Canal Exclusivo</span>'
    + '</div>'
    + '</div>'
    + '<div id="lm-content">'
    + '<div class="lm-loading">'
    + '<div class="lm-spinner"></div>'
    + '<p class="lm-loading-text">Carregando tabela Leroy Merlin...</p>'
    + '</div>'
    + '</div>';
}

// ── CARREGAR DADOS ────────────────────────────────────────────────────────────

async function carregarLeroyMerlin() {
  var container = document.getElementById('lm-content');
  if (!container) return;

  var res = await _sb
    .from('concremtp_leroy')
    .select('*')
    .eq('ativo', true)
    .order('tipo')
    .order('linha_cor')
    .order('modelo')
    .order('local')
    .order('largura_tipo');

  if (res.error || !res.data || res.data.length === 0) {
    container.innerHTML = '<div class="lm-empty">'
      + '<div class="lm-empty-icon"><i class="ti ti-package-off"></i></div>'
      + '<p class="lm-empty-text">Nenhum produto encontrado.</p>'
      + '</div>';
    return;
  }

  _lmData = res.data;
  _lmFiltroTipo   = '';
  _lmFiltroModelo = '';
  _lmFiltroLocal  = '';
  _lmFiltroLinha  = '';

  var tipos   = _lmUniq(_lmData.map(function(r) { return r.tipo; })).sort();
  var modelos = _lmUniq(_lmData.map(function(r) { return r.modelo; })).sort();
  var locais  = _lmUniq(_lmData.map(function(r) { return r.local; })).sort();
  var linhas  = _lmUniq(_lmData.map(function(r) { return r.linha_cor; })).sort();

  var optTipo   = tipos.map(function(v)   { return '<option value="' + _lmEsc(v) + '">' + _lmEsc(v) + '</option>'; }).join('');
  var optModelo = modelos.map(function(v) { return '<option value="' + _lmEsc(v) + '">' + _lmEsc(v) + '</option>'; }).join('');
  var optLocal  = locais.map(function(v)  { return '<option value="' + _lmEsc(v) + '">' + _lmEsc(v) + '</option>'; }).join('');
  var optLinha  = linhas.map(function(v)  { return '<option value="' + _lmEsc(v) + '">' + _lmEsc(v) + '</option>'; }).join('');

  container.innerHTML = '<div class="lm-toolbar">'
    + '<div class="lm-filters">'
    + '<select class="lm-select" onchange="lmSetFiltro(\'tipo\', this.value)">'
    + '<option value="">Todos os tipos</option>' + optTipo
    + '</select>'
    + '<select class="lm-select" onchange="lmSetFiltro(\'modelo\', this.value)">'
    + '<option value="">Todos os modelos</option>' + optModelo
    + '</select>'
    + '<select class="lm-select" onchange="lmSetFiltro(\'local\', this.value)">'
    + '<option value="">Todos os locais</option>' + optLocal
    + '</select>'
    + '<select class="lm-select" onchange="lmSetFiltro(\'linha\', this.value)">'
    + '<option value="">Todas as linhas</option>' + optLinha
    + '</select>'
    + '</div>'
    + '<button class="lm-print-btn" onclick="lmImprimir()">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'
    + ' Imprimir'
    + '</button>'
    + '</div>'
    + '<div class="table-card"><div class="table-wrap" id="lm-table-wrap">'
    + _lmRenderTabela(_lmData)
    + '</div></div>';
}

// ── FILTROS ───────────────────────────────────────────────────────────────────

function lmSetFiltro(campo, valor) {
  if (campo === 'tipo')   _lmFiltroTipo   = valor;
  if (campo === 'modelo') _lmFiltroModelo = valor;
  if (campo === 'local')  _lmFiltroLocal  = valor;
  if (campo === 'linha')  _lmFiltroLinha  = valor;
  lmFiltrar();
}

function lmFiltrar() {
  var filtrado = _lmData.filter(function(r) {
    if (_lmFiltroTipo   && r.tipo      !== _lmFiltroTipo)   return false;
    if (_lmFiltroModelo && r.modelo    !== _lmFiltroModelo) return false;
    if (_lmFiltroLocal  && r.local     !== _lmFiltroLocal)  return false;
    if (_lmFiltroLinha  && r.linha_cor !== _lmFiltroLinha)  return false;
    return true;
  });
  var wrap = document.getElementById('lm-table-wrap');
  if (wrap) wrap.innerHTML = _lmRenderTabela(filtrado);
}

// ── RENDERIZAR TABELA ─────────────────────────────────────────────────────────

var _LM_TIPO_CLS = {
  CORRER:    'lm-badge-correr',
  GIRO:      'lm-badge-giro',
  PIVOTANTE: 'lm-badge-pivotante',
  FOLHA:     'lm-badge-folha',
  ALIZAR:    'lm-badge-alizar',
};

function _lmRenderTabela(rows) {
  if (!rows || rows.length === 0) {
    return '<div class="lm-empty">'
      + '<div class="lm-empty-icon"><i class="ti ti-search-off"></i></div>'
      + '<p class="lm-empty-text">Nenhum produto encontrado.</p>'
      + '</div>';
  }

  var trs = rows.map(function(r, i) {
    var tipoUpper = String(r.tipo || '').toUpperCase();
    var tipoCls   = _LM_TIPO_CLS[tipoUpper] || 'lm-badge-alizar';
    var reajCls   = r.reajustar ? 'lm-badge-sim' : 'lm-badge-nao';
    var reajTxt   = r.reajustar ? 'Sim' : 'Não';
    var zebra     = i % 2 !== 0 ? ' lm-zebra' : '';
    return '<tr class="lm-row' + zebra + '">'
      + '<td><span class="lm-type-badge ' + tipoCls + '">' + _lmEsc(r.tipo || '') + '</span></td>'
      + '<td>' + _lmEsc(r.batente  || '—') + '</td>'
      + '<td>' + _lmEsc(r.modelo   || '—') + '</td>'
      + '<td>' + _lmEsc(r.local    || '—') + '</td>'
      + '<td>' + _lmEsc(r.linha_cor || '—') + '</td>'
      + '<td>' + _lmEsc(r.largura_tipo || '—') + '</td>'
      + '<td class="lm-price">' + _lmFmt(r.preco_leroy) + '</td>'
      + '<td class="lm-price-concrem">' + _lmFmt(r.preco_concrem) + '</td>'
      + '<td class="lm-price">' + _lmFmt(r.frete) + '</td>'
      + '<td><span class="lm-reaj-badge ' + reajCls + '">' + reajTxt + '</span></td>'
      + '</tr>';
  }).join('');

  return '<table class="lm-table">'
    + '<thead><tr>'
    + '<th>TIPO</th><th>BATENTE</th><th>MODELO</th><th>LOCAL</th>'
    + '<th>LINHA/COR</th><th>LARGURA</th>'
    + '<th>PREÇO LEROY</th><th>PREÇO CONCREM</th><th>FRETE</th><th>REAJUSTAR</th>'
    + '</tr></thead>'
    + '<tbody>' + trs + '</tbody>'
    + '</table>';
}

// ── IMPRESSÃO ─────────────────────────────────────────────────────────────────

function lmImprimir() {
  window._lmPrinting = true;
  window.print();
  window._lmPrinting = false;
}

// ── UTILS ─────────────────────────────────────────────────────────────────────

function _lmFmt(v) {
  var n = parseFloat(v);
  if (isNaN(n)) return '—';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function _lmEsc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _lmUniq(arr) {
  return arr.filter(function(v, i, a) { return v && a.indexOf(v) === i; });
}

// ── HOOK onAfterRender ────────────────────────────────────────────────────────

(function() {
  var _prev = typeof window.onAfterRender === 'function' ? window.onAfterRender : null;
  window.onAfterRender = function(section) {
    if (_prev) _prev(section);
    if (section === 'leroyMerlin') carregarLeroyMerlin();
  };
})();
