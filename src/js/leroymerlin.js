// ── LEROY MERLIN ─────────────────────────────────────────────────────────────

var _lmData         = [];
var _lmFiltroTipo   = '';
var _lmFiltroModelo = '';
var _lmFiltroLocal  = '';
var _lmFiltroLinha  = '';

// ── RENDER ESQUELETO (chamado sincronamente por render()) ─────────────────────

function renderLeroyMerlin() {
  return `
    <div class="page-header">
      <div class="page-title">Tabela Leroy Merlin</div>
      <div class="page-meta">
        <span class="meta-pill">Canal Exclusivo · Preços CIF</span>
        Atualizado em fev/2026
      </div>
    </div>
    <div id="lm-content">
      <div class="lm-loading">
        <div class="lm-spinner"></div>
        <p class="lm-loading-text">Carregando tabela Leroy Merlin...</p>
      </div>
    </div>`;
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
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="ti ti-package-off"></i></div>
        <p class="empty-text">Nenhum produto encontrado.</p>
      </div>`;
    return;
  }

  _lmData         = res.data;
  _lmFiltroTipo   = '';
  _lmFiltroModelo = '';
  _lmFiltroLocal  = '';
  _lmFiltroLinha  = '';

  _lmRenderContainer(container, _lmData);
}

// ── MONTAR CONTAINER COM FILTROS + TABELA ─────────────────────────────────────

function _lmRenderContainer(container, data) {
  var uniq = function(arr) { return arr.filter(function(v, i, a) { return v && a.indexOf(v) === i; }).sort(); };
  var tipos   = uniq(_lmData.map(function(r) { return r.tipo; }));
  var modelos = uniq(_lmData.map(function(r) { return r.modelo; }));
  var locais  = uniq(_lmData.map(function(r) { return r.local; }));
  var linhas  = uniq(_lmData.map(function(r) { return r.linha_cor; }));

  function sel(campo, opts, current, label) {
    return '<select class="lm-select" onchange="lmSetFiltro(\'' + campo + '\', this.value)">'
      + '<option value="">' + label + '</option>'
      + opts.map(function(v) {
          return '<option value="' + _lmEsc(v) + '"' + (v === current ? ' selected' : '') + '>' + _lmEsc(v) + '</option>';
        }).join('')
      + '</select>';
  }

  container.innerHTML =
    '<div class="lm-toolbar">'
    + '<div class="lm-filters">'
    + sel('tipo',   tipos,   _lmFiltroTipo,   'Todos os tipos')
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
    + _lmRenderTabela(_lmFiltrar(_lmData))
    + '</div></div>';

  if (typeof applySearch === 'function') applySearch();
}

// ── FILTRAR ───────────────────────────────────────────────────────────────────

function _lmFiltrar(rows) {
  return rows.filter(function(r) {
    if (_lmFiltroTipo   && r.tipo      !== _lmFiltroTipo)   return false;
    if (_lmFiltroModelo && r.modelo    !== _lmFiltroModelo) return false;
    if (_lmFiltroLocal  && r.local     !== _lmFiltroLocal)  return false;
    if (_lmFiltroLinha  && r.linha_cor !== _lmFiltroLinha)  return false;
    return true;
  });
}

function lmSetFiltro(campo, valor) {
  if (campo === 'tipo')   _lmFiltroTipo   = valor;
  if (campo === 'modelo') _lmFiltroModelo = valor;
  if (campo === 'local')  _lmFiltroLocal  = valor;
  if (campo === 'linha')  _lmFiltroLinha  = valor;
  var wrap = document.getElementById('lm-table-wrap');
  if (wrap) {
    wrap.innerHTML = _lmRenderTabela(_lmFiltrar(_lmData));
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
    var tipoUpper = String(r.tipo || '').toUpperCase();
    var tipoCls   = _LM_TIPO_CLS[tipoUpper] || 'lm-badge-alizar';
    var reajCls   = r.reajustar ? 'lm-badge-sim' : 'lm-badge-nao';
    var reajTxt   = r.reajustar ? 'Sim' : 'Não';
    var zebra     = i % 2 !== 0 ? ' lm-zebra' : '';

    // Aplica multiplicador de reajuste ao preço CONCREM (se houver reajuste ativo)
    var precoConcrem = parseFloat(r.preco_concrem) || 0;
    if (typeof rjGetM === 'function') {
      var rjM = rjGetM('Leroy Merlin', 'leroy', r.linha_cor);
      precoConcrem = precoConcrem * rjM;
    }

    return '<tr class="lm-row' + zebra + '">'
      + '<td><span class="lm-type-badge ' + tipoCls + '">' + _lmEsc(r.tipo || '') + '</span></td>'
      + '<td>' + _lmEsc(r.batente    || '—') + '</td>'
      + '<td>' + _lmEsc(r.modelo     || '—') + '</td>'
      + '<td>' + _lmEsc(r.local      || '—') + '</td>'
      + '<td>' + _lmEsc(r.linha_cor  || '—') + '</td>'
      + '<td>' + _lmEsc(r.largura_tipo || '—') + '</td>'
      + '<td class="lm-price">' + _lmFmt(r.preco_leroy) + '</td>'
      + '<td class="lm-price-concrem">' + _lmFmt(precoConcrem) + '</td>'
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

// ── IMPRESSÃO PADRÃO (nova janela, landscape) ─────────────────────────────────

function lmImprimir() {
  var rows = _lmFiltrar(_lmData);
  if (!rows.length) { alert('Nenhum dado para imprimir.'); return; }

  var LOGO     = new URL('Logos/logo-cores.png', window.location.href).href;
  var dateStr  = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  var filtros  = [];
  if (_lmFiltroTipo)   filtros.push('Tipo: ' + _lmFiltroTipo);
  if (_lmFiltroModelo) filtros.push('Modelo: ' + _lmFiltroModelo);
  if (_lmFiltroLocal)  filtros.push('Local: ' + _lmFiltroLocal);
  if (_lmFiltroLinha)  filtros.push('Linha: ' + _lmFiltroLinha);
  var filtroStr = filtros.length ? filtros.join(' · ') : 'Todos os produtos';

  var trs = rows.map(function(r) {
    var precoConcrem = parseFloat(r.preco_concrem) || 0;
    if (typeof rjGetM === 'function') precoConcrem *= rjGetM('Leroy Merlin', 'leroy', r.linha_cor);
    return '<tr>'
      + '<td>' + _lmEsc(r.tipo || '') + '</td>'
      + '<td>' + _lmEsc(r.batente    || '—') + '</td>'
      + '<td>' + _lmEsc(r.modelo     || '—') + '</td>'
      + '<td>' + _lmEsc(r.local      || '—') + '</td>'
      + '<td>' + _lmEsc(r.linha_cor  || '—') + '</td>'
      + '<td>' + _lmEsc(r.largura_tipo || '—') + '</td>'
      + '<td style="text-align:right">' + _lmFmt(r.preco_leroy) + '</td>'
      + '<td style="text-align:right;font-weight:bold;color:#1a5c2a">' + _lmFmt(precoConcrem) + '</td>'
      + '<td style="text-align:right">' + _lmFmt(r.frete) + '</td>'
      + '<td style="text-align:center">' + (r.reajustar ? 'Sim' : 'Não') + '</td>'
      + '</tr>';
  }).join('');

  var html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">'
    + '<title>Leroy Merlin — CONCREM</title>'
    + '<style>'
    + '@page{size:landscape;margin:10mm}'
    + 'body{font-family:Arial,sans-serif;font-size:9px;color:#222;margin:0;padding:0}'
    + '.ph{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #1a5c2a;padding-bottom:6px;margin-bottom:8px}'
    + '.ph img{height:36px}'
    + '.ph-info{text-align:right}'
    + '.ph-title{font-size:14px;font-weight:bold;color:#1a2b4a}'
    + '.ph-sub{font-size:9px;color:#555;margin-top:2px}'
    + '.ph-badge{display:inline-block;background:#1a5c2a;color:#fff;font-size:8px;font-weight:bold;padding:2px 7px;border-radius:10px;margin-top:3px}'
    + 'table{border-collapse:collapse;width:100%}'
    + 'th{background:#1a2b4a;color:#fff;font-size:8.5px;padding:4px 6px;text-align:left;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    + 'td{border:0.5px solid #ddd;padding:3px 6px;font-size:8.5px;vertical-align:middle}'
    + 'tr:nth-child(even) td{background:#f5f5f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    + '.footer{margin-top:8px;font-size:7.5px;color:#888;text-align:center}'
    + '</style></head><body>'
    + '<div class="ph">'
    + '<img src="' + LOGO + '" alt="CONCREM">'
    + '<div class="ph-info">'
    + '<div class="ph-title">Tabela Leroy Merlin</div>'
    + '<div class="ph-sub">' + filtroStr + ' · ' + dateStr + '</div>'
    + '<span class="ph-badge">Canal Exclusivo · Preços CIF</span>'
    + '</div>'
    + '</div>'
    + '<table>'
    + '<thead><tr>'
    + '<th>TIPO</th><th>BATENTE</th><th>MODELO</th><th>LOCAL</th>'
    + '<th>LINHA/COR</th><th>LARGURA</th>'
    + '<th>PREÇO LEROY</th><th>PREÇO CONCREM</th><th>FRETE</th><th>REAJUSTAR</th>'
    + '</tr></thead>'
    + '<tbody>' + trs + '</tbody>'
    + '</table>'
    + '<div class="footer">CONCREM Portas Premium · ' + rows.length + ' itens · Impresso em ' + dateStr + '</div>'
    + '</body></html>';

  var w = window.open('', '_blank', 'width=1100,height=700');
  w.document.write(html);
  w.document.close();
  w.onload = function() { w.print(); };
}

// ── EXPORTAR CSV ──────────────────────────────────────────────────────────────

function lmExportarCSV() {
  var rows = _lmFiltrar(_lmData);
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
  a.download = 'leroy-merlin-' + new Date().toISOString().slice(0, 10) + '.csv';
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

// ── HOOK onAfterRender ────────────────────────────────────────────────────────

(function() {
  var _prev = typeof window.onAfterRender === 'function' ? window.onAfterRender : null;
  window.onAfterRender = function(section) {
    if (_prev) _prev(section);
    if (section === 'leroyMerlin') carregarLeroyMerlin();
  };
})();
