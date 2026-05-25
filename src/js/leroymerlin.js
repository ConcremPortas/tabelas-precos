// ── LEROY MERLIN ─────────────────────────────────────────────────────────────

var _lmData         = [];
var _lmActiveTipo   = '';   // controlado pelas abas
var _lmFiltroModelo = '';
var _lmFiltroLocal  = '';
var _lmFiltroLinha  = '';

// ── RENDER ESQUELETO (chamado sincronamente por render()) ─────────────────────

function renderLeroyMerlin() {
  return '<div class="page-header">'
    + '<div class="page-title">Tabela Leroy Merlin</div>'
    + '<div class="page-meta">'
    + '<span class="meta-pill">Canal Exclusivo · Preços CIF</span>'
    + ' Atualizado em fev/2026'
    + '</div>'
    + '</div>'
    + '<div id="lm-content">'
    + '<div class="lm-loading">'
    + '<div class="lm-spinner"></div>'
    + '<p class="lm-loading-text">Carregando tabela Leroy Merlin...</p>'
    + '</div>'
    + '</div>';
}

// ── CARREGAR DADOS DO SUPABASE ────────────────────────────────────────────────

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
    container.innerHTML = '<div class="empty-state">'
      + '<div class="empty-icon"><i class="ti ti-package-off"></i></div>'
      + '<p class="empty-text">Nenhum produto encontrado.</p>'
      + '</div>';
    return;
  }

  _lmData         = res.data;
  _lmActiveTipo   = '';   // _lmRenderContainer define o primeiro tipo
  _lmFiltroModelo = '';
  _lmFiltroLocal  = '';
  _lmFiltroLinha  = '';

  _lmRenderContainer(container);
}

// ── MONTAR CONTAINER: ABAS + FILTROS + TABELA ─────────────────────────────────

function _lmRenderContainer(container) {
  var tipos = _lmUniq(_lmData.map(function(r) { return r.tipo; }));

  // Garante que a aba ativa é válida
  if (!_lmActiveTipo || tipos.indexOf(_lmActiveTipo) === -1) {
    _lmActiveTipo = tipos[0] || '';
  }

  // Dados do tipo ativo
  var tipoData = _lmData.filter(function(r) { return r.tipo === _lmActiveTipo; });

  // Opções de filtro baseadas apenas no tipo ativo
  var modelos = _lmUniq(tipoData.map(function(r) { return r.modelo; }));
  var locais  = _lmUniq(tipoData.map(function(r) { return r.local; }));
  var linhas  = _lmUniq(tipoData.map(function(r) { return r.linha_cor; }));

  // Barra de abas (igual ao padrão do Rodapé)
  var tabBar = '<div class="inner-tabs-bar">'
    + tipos.map(function(t) {
        var active = _lmActiveTipo === t ? ' active' : '';
        return '<button class="inner-tab' + active + '" onclick="lmSetTipo(\'' + _lmEsc(t) + '\')">'
          + _lmEsc(t) + '</button>';
      }).join('')
    + '</div>';

  function sel(campo, opts, current, label) {
    return '<select class="lm-select" onchange="lmSetFiltro(\'' + campo + '\', this.value)">'
      + '<option value="">' + label + '</option>'
      + opts.map(function(v) {
          return '<option value="' + _lmEsc(v) + '"' + (v === current ? ' selected' : '') + '>'
            + _lmEsc(v) + '</option>';
        }).join('')
      + '</select>';
  }

  container.innerHTML =
    tabBar
    + '<div class="lm-toolbar">'
    + '<div class="lm-filters">'
    + sel('modelo', modelos, _lmFiltroModelo, 'Todos os modelos')
    + sel('local',  locais,  _lmFiltroLocal,  'Todos os locais')
    + sel('linha',  linhas,  _lmFiltroLinha,  'Todas as linhas')
    + '</div>'
    + '<div class="lm-toolbar-actions">'
    + '<button class="lm-export-btn" onclick="lmExportarCSV()" title="Exportar CSV">'
    + '<i class="ti ti-download"></i> CSV</button>'
    + '<button class="lm-print-btn" onclick="lmImprimir()">'
    + '<i class="ti ti-printer"></i> Imprimir PDF</button>'
    + '</div>'
    + '</div>'
    + '<div class="table-card"><div class="table-wrap" id="lm-table-wrap">'
    + _lmRenderTabela(_lmFiltrar(tipoData))
    + '</div></div>';

  if (typeof applySearch === 'function') applySearch();
}

// ── MUDAR ABA DE TIPO ─────────────────────────────────────────────────────────

function lmSetTipo(tipo) {
  _lmActiveTipo   = tipo;
  _lmFiltroModelo = '';
  _lmFiltroLocal  = '';
  _lmFiltroLinha  = '';
  var container = document.getElementById('lm-content');
  if (container) _lmRenderContainer(container);
}

// ── FILTROS SECUNDÁRIOS ───────────────────────────────────────────────────────

function _lmFiltrar(rows) {
  return rows.filter(function(r) {
    if (_lmFiltroModelo && r.modelo    !== _lmFiltroModelo) return false;
    if (_lmFiltroLocal  && r.local     !== _lmFiltroLocal)  return false;
    if (_lmFiltroLinha  && r.linha_cor !== _lmFiltroLinha)  return false;
    return true;
  });
}

function lmSetFiltro(campo, valor) {
  if (campo === 'modelo') _lmFiltroModelo = valor;
  if (campo === 'local')  _lmFiltroLocal  = valor;
  if (campo === 'linha')  _lmFiltroLinha  = valor;
  var tipoData = _lmData.filter(function(r) { return r.tipo === _lmActiveTipo; });
  var wrap = document.getElementById('lm-table-wrap');
  if (wrap) {
    wrap.innerHTML = _lmRenderTabela(_lmFiltrar(tipoData));
    if (typeof applySearch === 'function') applySearch();
  }
}

// ── RENDERIZAR TABELA ─────────────────────────────────────────────────────────

var _LM_TIPO_CLS = {
  CORRER: 'lm-badge-correr', GIRO: 'lm-badge-giro',
  PIVOTANTE: 'lm-badge-pivotante', FOLHA: 'lm-badge-folha', ALIZAR: 'lm-badge-alizar',
};

function _lmRenderTabela(rows) {
  if (!rows || rows.length === 0) {
    return '<div class="empty-state">'
      + '<div class="empty-icon"><i class="ti ti-search-off"></i></div>'
      + '<p class="empty-text">Nenhum produto encontrado com os filtros aplicados.</p>'
      + '</div>';
  }

  var trs = rows.map(function(r, i) {
    var reajCls = r.reajustar ? 'lm-badge-sim' : 'lm-badge-nao';
    var reajTxt = r.reajustar ? 'Sim' : 'Não';
    var zebra   = i % 2 !== 0 ? ' lm-zebra' : '';

    var precoConcrem = parseFloat(r.preco_concrem) || 0;
    if (typeof rjGetM === 'function') {
      precoConcrem = precoConcrem * rjGetM('Leroy Merlin', 'leroy', r.linha_cor);
    }

    return '<tr class="lm-row' + zebra + '">'
      + '<td>' + _lmEsc(r.batente     || '—') + '</td>'
      + '<td>' + _lmEsc(r.modelo      || '—') + '</td>'
      + '<td>' + _lmEsc(r.local       || '—') + '</td>'
      + '<td>' + _lmEsc(r.linha_cor   || '—') + '</td>'
      + '<td>' + _lmEsc(r.largura_tipo || '—') + '</td>'
      + '<td class="lm-price">'        + _lmFmt(r.preco_leroy)  + '</td>'
      + '<td class="lm-price-concrem">' + _lmFmt(precoConcrem)  + '</td>'
      + '<td class="lm-price">'        + _lmFmt(r.frete)        + '</td>'
      + '<td><span class="lm-reaj-badge ' + reajCls + '">' + reajTxt + '</span></td>'
      + '</tr>';
  }).join('');

  return '<table class="lm-table">'
    + '<thead><tr>'
    + '<th>BATENTE</th><th>MODELO</th><th>LOCAL</th>'
    + '<th>LINHA/COR</th><th>LARGURA</th>'
    + '<th>PREÇO LEROY</th><th>PREÇO CONCREM</th><th>FRETE</th><th>REAJUSTAR</th>'
    + '</tr></thead>'
    + '<tbody>' + trs + '</tbody>'
    + '</table>';
}

// ── IMPRESSÃO ─────────────────────────────────────────────────────────────────

function lmImprimir() {
  var tipoData = _lmData.filter(function(r) { return r.tipo === _lmActiveTipo; });
  var rows = _lmFiltrar(tipoData);
  if (!rows.length) { alert('Nenhum dado para imprimir.'); return; }

  var LOGO    = new URL('Logos/logo-cores.png', window.location.href).href;
  var dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  var THEAD = '<thead><tr>'
    + '<th>BATENTE</th><th>MODELO</th><th>LOCAL</th>'
    + '<th>LINHA/COR</th><th>LARGURA</th>'
    + '<th>PREÇO LEROY</th><th>PREÇO CONCREM</th><th>FRETE</th>'
    + '</tr></thead>';

  var trs = rows.map(function(r, i) {
    var precoConcrem = parseFloat(r.preco_concrem) || 0;
    if (typeof rjGetM === 'function') precoConcrem *= rjGetM('Leroy Merlin', 'leroy', r.linha_cor);
    var zebra = i % 2 !== 0 ? 'background:#f5f5f5;' : '';
    return '<tr>'
      + '<td style="' + zebra + '">' + _lmEsc(r.batente     || '—') + '</td>'
      + '<td style="' + zebra + '">' + _lmEsc(r.modelo      || '—') + '</td>'
      + '<td style="' + zebra + '">' + _lmEsc(r.local       || '—') + '</td>'
      + '<td style="' + zebra + '">' + _lmEsc(r.linha_cor   || '—') + '</td>'
      + '<td style="' + zebra + '">' + _lmEsc(r.largura_tipo || '—') + '</td>'
      + '<td style="text-align:right;' + zebra + '">' + _lmFmt(r.preco_leroy) + '</td>'
      + '<td style="text-align:right;font-weight:bold;color:#1a5c2a;' + zebra + '">' + _lmFmt(precoConcrem) + '</td>'
      + '<td style="text-align:right;' + zebra + '">' + _lmFmt(r.frete) + '</td>'
      + '</tr>';
  }).join('');

  var html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">'
    + '<title>Leroy Merlin — ' + _lmEsc(_lmActiveTipo) + ' — CONCREM</title>'
    + '<style>'
    + '* { margin:0; padding:0; box-sizing:border-box; }'
    + '@page { size:A4 landscape; margin:0; }'
    + 'body { font-family:Arial,sans-serif; font-size:9px; color:#1a1a1a; background:#fff; padding:8mm 10mm; }'
    + '.phdr { width:100%; margin-bottom:8px; }'
    + '.phdr td { padding:0 6px 5px; border-bottom:2.5px solid #1a5c2a; vertical-align:middle; }'
    + '.phdr-logo { width:90px; } .phdr-logo img { height:30px; }'
    + '.phdr-title { text-align:center; font-size:13px; font-weight:bold; text-transform:uppercase; }'
    + '.phdr-chan { text-align:right; font-size:11px; font-weight:bold; color:#1a5c2a; text-transform:uppercase; white-space:nowrap; }'
    + '.ppt { border-collapse:collapse; width:100%; }'
    + '.ppt th { background:#2c3e50; color:#fff; font-size:8px; padding:3px 5px; text-align:center; border:0.5px solid #444; -webkit-print-color-adjust:exact; print-color-adjust:exact; }'
    + '.ppt td { border:0.5px solid #ccc; padding:2px 5px; font-size:8px; vertical-align:middle; }'
    + '.pftr { margin-top:8px; border-top:1px solid #ccc; padding-top:4px; text-align:center; }'
    + '.pftr img { height:18px; opacity:.5; }'
    + '.pftr-date { font-size:7px; color:#888; margin-top:2px; }'
    + '</style></head><body>'
    + '<table class="phdr" width="100%"><tr>'
    + '<td class="phdr-logo"><img src="' + LOGO + '" alt="CONCREM"></td>'
    + '<td class="phdr-title">LEROY MERLIN — ' + _lmEsc(_lmActiveTipo.toUpperCase()) + ' — PREÇOS CIF</td>'
    + '<td class="phdr-chan">Canal Exclusivo</td>'
    + '</tr></table>'
    + '<table class="ppt">' + THEAD + '<tbody>' + trs + '</tbody></table>'
    + '<div class="pftr"><img src="' + LOGO + '" alt="CONCREM"><div class="pftr-date">' + dateStr + '</div></div>'
    + '</body></html>';

  var w = window.open('', '_blank', 'width=1100,height=700');
  if (!w) { alert('Popup bloqueado. Permita popups para este site.'); return; }
  w.document.write(html);
  w.document.close();
  w.onload = function() { w.print(); };
}

// ── EXPORTAR CSV ──────────────────────────────────────────────────────────────

function lmExportarCSV() {
  var tipoData = _lmData.filter(function(r) { return r.tipo === _lmActiveTipo; });
  var rows = _lmFiltrar(tipoData);
  if (!rows.length) { alert('Nenhum dado para exportar.'); return; }

  var header = ['TIPO','BATENTE','MODELO','LOCAL','LINHA/COR','LARGURA','PRECO_LEROY','PRECO_CONCREM','FRETE','REAJUSTAR'];
  var linhas  = [header.join(';')];
  rows.forEach(function(r) {
    var precoConcrem = parseFloat(r.preco_concrem) || 0;
    if (typeof rjGetM === 'function') precoConcrem *= rjGetM('Leroy Merlin', 'leroy', r.linha_cor);
    linhas.push([
      r.tipo || '', r.batente || '', r.modelo || '', r.local || '',
      r.linha_cor || '', r.largura_tipo || '',
      (parseFloat(r.preco_leroy) || 0).toFixed(2).replace('.', ','),
      precoConcrem.toFixed(2).replace('.', ','),
      (parseFloat(r.frete) || 0).toFixed(2).replace('.', ','),
      r.reajustar ? 'Sim' : 'Não',
    ].map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'));
  });

  var csv  = '﻿' + linhas.join('\r\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href     = url;
  a.download = 'leroy-' + (_lmActiveTipo || 'todos').toLowerCase() + '-' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
  return arr.filter(function(v, i, a) { return v && a.indexOf(v) === i; }).sort();
}

// ── HOOK onAfterRender ────────────────────────────────────────────────────────

(function() {
  var _prev = typeof window.onAfterRender === 'function' ? window.onAfterRender : null;
  window.onAfterRender = function(section) {
    if (_prev) _prev(section);
    if (section === 'leroyMerlin') carregarLeroyMerlin();
  };
})();
