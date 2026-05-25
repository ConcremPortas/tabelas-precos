// ── LEROY MERLIN ─────────────────────────────────────────────────────────────

var _lmData         = [];
var _lmActiveTipo   = '';
var _lmFiltroModelo = '';
var _lmFiltroLocal  = '';
var _lmFiltroLinha  = '';
var _lmEditMode     = false;
var _lmPending      = {};   // id → { campo: valor }

// ── RENDER ESQUELETO ──────────────────────────────────────────────────────────

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
    container.innerHTML = '<div class="empty-state">'
      + '<div class="empty-icon"><i class="ti ti-package-off"></i></div>'
      + '<p class="empty-text">Nenhum produto encontrado.</p>'
      + '</div>';
    return;
  }

  _lmData = res.data;
  _lmEditMode     = false;
  _lmPending      = {};
  _lmFiltroModelo = '';
  _lmFiltroLocal  = '';
  _lmFiltroLinha  = '';

  _lmRenderContainer(container);
}

// ── CONTAINER: ABAS + FILTROS + TABELA + BOTÕES ───────────────────────────────

function _lmRenderContainer(container) {
  var tipos = _lmUniq(_lmData.map(function(r) { return r.tipo; }));

  if (!_lmActiveTipo || tipos.indexOf(_lmActiveTipo) === -1) {
    _lmActiveTipo = tipos[0] || '';
  }

  var tipoData = _lmData.filter(function(r) { return r.tipo === _lmActiveTipo; });
  var modelos  = _lmUniq(tipoData.map(function(r) { return r.modelo; }));
  var locais   = _lmUniq(tipoData.map(function(r) { return r.local; }));
  var linhas   = _lmUniq(tipoData.map(function(r) { return r.linha_cor; }));

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

  var actionsHtml = '';
  if (!_lmEditMode) {
    actionsHtml = '<button class="lm-export-btn" onclick="lmExportarCSV()" title="Exportar CSV">'
      + '<i class="ti ti-download"></i> CSV</button>';
  }

  container.innerHTML =
    tabBar
    + '<div class="lm-toolbar">'
    + '<div class="lm-filters">'
    + sel('modelo', modelos, _lmFiltroModelo, 'Todos os modelos')
    + sel('local',  locais,  _lmFiltroLocal,  'Todos os locais')
    + sel('linha',  linhas,  _lmFiltroLinha,  'Todas as linhas')
    + '</div>'
    + '<div class="lm-toolbar-actions">' + actionsHtml + '</div>'
    + '</div>'
    + '<div class="table-card"><div class="table-wrap" id="lm-table-wrap">'
    + _lmRenderTabela(_lmFiltrar(tipoData))
    + '</div></div>';

  _lmInjectButtons();
  if (typeof applySearch === 'function') applySearch();
}

// ── INJETAR BOTÕES NO PAGE-HEADER ─────────────────────────────────────────────

function _lmInjectButtons() {
  document.querySelectorAll('.lm-edit-btn-wrap, .lm-add-btn').forEach(function(el) { el.remove(); });

  var canEdit = temPermissao('editar_itens_tabela') || temPermissao('remover_itens_tabela');
  var canAdd  = temPermissao('adicionar_itens_tabela');
  if (!canEdit && !canAdd) return;

  var header = document.querySelector('.page-header');
  if (!header) return;

  if (_lmEditMode) {
    var wrap = document.createElement('div');
    wrap.className = 'lm-edit-btn-wrap gm-edit-btn-wrap';
    wrap.innerHTML =
      '<button class="gm-btn-concluir" onclick="lmConcluirEdicao()">✅ Concluir edição</button>'
      + '<button class="gm-btn-cancelar" onclick="lmCancelarEdicao()">✕ Cancelar</button>';
    header.appendChild(wrap);
  } else {
    if (canAdd) {
      var addBtn = document.createElement('button');
      addBtn.className = 'lm-add-btn gt-shortcut-btn';
      addBtn.innerHTML = '<i class="ti ti-table-plus"></i> + Novo item';
      addBtn.onclick = function() { gtOpenLeroyFromShortcut(_lmActiveTipo); };
      header.appendChild(addBtn);
    }
    if (canEdit) {
      var editWrap = document.createElement('div');
      editWrap.className = 'lm-edit-btn-wrap gm-edit-btn-wrap';
      editWrap.innerHTML = '<button class="gm-btn-edit" onclick="lmToggleEdit()">✏️ Editar tabela</button>';
      header.appendChild(editWrap);
    }
  }
}

// ── ABAS DE TIPO ──────────────────────────────────────────────────────────────

function lmSetTipo(tipo) {
  if (_lmEditMode) return;
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
  if (_lmEditMode) return;
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

function _lmRenderTabela(rows) {
  if (!rows || rows.length === 0) {
    return '<div class="empty-state">'
      + '<div class="empty-icon"><i class="ti ti-search-off"></i></div>'
      + '<p class="empty-text">Nenhum produto encontrado com os filtros aplicados.</p>'
      + '</div>';
  }

  var canDel = _lmEditMode && temPermissao('remover_itens_tabela');

  var trs = rows.map(function(r, i) {
    var reajCls = r.reajustar ? 'lm-badge-sim' : 'lm-badge-nao';
    var reajTxt = r.reajustar ? 'Sim' : 'Não';
    var zebra   = i % 2 !== 0 ? ' lm-zebra' : '';

    var precoConcrem = parseFloat(r.preco_concrem) || 0;
    if (!_lmEditMode && typeof rjGetM === 'function') {
      precoConcrem = precoConcrem * rjGetM('Leroy Merlin', 'leroy', r.linha_cor);
    }

    if (_lmEditMode) {
      var pend = _lmPending[r.id] || {};
      var vLeroy   = pend.preco_leroy   !== undefined ? pend.preco_leroy   : (parseFloat(r.preco_leroy)   || 0);
      var vConcrem = pend.preco_concrem !== undefined ? pend.preco_concrem : (parseFloat(r.preco_concrem) || 0);
      var vFrete   = pend.frete         !== undefined ? pend.frete         : (parseFloat(r.frete)         || 0);
      var vReaj    = pend.reajustar     !== undefined ? pend.reajustar     : !!r.reajustar;
      var id       = _lmEsc(String(r.id));

      return '<tr class="lm-row' + zebra + '" data-lm-id="' + id + '">'
        + '<td>' + _lmEsc(r.batente     || '—') + '</td>'
        + '<td>' + _lmEsc(r.modelo      || '—') + '</td>'
        + '<td>' + _lmEsc(r.local       || '—') + '</td>'
        + '<td>' + _lmEsc(r.linha_cor   || '—') + '</td>'
        + '<td>' + _lmEsc(r.largura_tipo || '—') + '</td>'
        + '<td class="lm-price"><input class="gm-price-input" type="number" step="0.01" min="0" value="'
          + Number(vLeroy).toFixed(2) + '" onchange="lmSetPending(\'' + id + '\',\'preco_leroy\',+this.value)"></td>'
        + '<td class="lm-price-concrem"><input class="gm-price-input" type="number" step="0.01" min="0" value="'
          + Number(vConcrem).toFixed(2) + '" onchange="lmSetPending(\'' + id + '\',\'preco_concrem\',+this.value)"></td>'
        + '<td class="lm-price"><input class="gm-price-input" type="number" step="0.01" min="0" value="'
          + Number(vFrete).toFixed(2) + '" onchange="lmSetPending(\'' + id + '\',\'frete\',+this.value)"></td>'
        + '<td style="text-align:center"><input type="checkbox"' + (vReaj ? ' checked' : '')
          + ' onchange="lmSetPending(\'' + id + '\',\'reajustar\',this.checked)"></td>'
        + (canDel ? '<td><button class="gm-btn-del" onclick="lmRemoverItem(\'' + id + '\')" title="Remover linha">✕</button></td>' : '')
        + '</tr>';
    }

    return '<tr class="lm-row' + zebra + '">'
      + '<td>' + _lmEsc(r.batente     || '—') + '</td>'
      + '<td>' + _lmEsc(r.modelo      || '—') + '</td>'
      + '<td>' + _lmEsc(r.local       || '—') + '</td>'
      + '<td>' + _lmEsc(r.linha_cor   || '—') + '</td>'
      + '<td>' + _lmEsc(r.largura_tipo || '—') + '</td>'
      + '<td class="lm-price">'         + _lmFmt(r.preco_leroy)  + '</td>'
      + '<td class="lm-price-concrem">' + _lmFmt(precoConcrem)   + '</td>'
      + '<td class="lm-price">'         + _lmFmt(r.frete)        + '</td>'
      + '<td><span class="lm-reaj-badge ' + reajCls + '">' + reajTxt + '</span></td>'
      + '</tr>';
  }).join('');

  var extraTh = canDel ? '<th></th>' : '';
  return '<table class="lm-table">'
    + '<thead><tr>'
    + '<th>BATENTE</th><th>MODELO</th><th>LOCAL</th>'
    + '<th>LINHA/COR</th><th>LARGURA</th>'
    + '<th>PREÇO LEROY</th><th>PREÇO CONCREM</th><th>FRETE</th><th>REAJUSTAR</th>'
    + extraTh
    + '</tr></thead>'
    + '<tbody>' + trs + '</tbody>'
    + '</table>';
}

// ── EDIT MODE ─────────────────────────────────────────────────────────────────

function lmToggleEdit() {
  _lmEditMode = true;
  _lmPending  = {};
  var container = document.getElementById('lm-content');
  if (container) _lmRenderContainer(container);
}

function lmCancelarEdicao() {
  _lmEditMode = false;
  _lmPending  = {};
  var container = document.getElementById('lm-content');
  if (container) _lmRenderContainer(container);
}

function lmSetPending(id, campo, valor) {
  if (!_lmPending[id]) _lmPending[id] = {};
  _lmPending[id][campo] = valor;
}

async function lmConcluirEdicao() {
  var ids = Object.keys(_lmPending);
  if (!ids.length) { lmCancelarEdicao(); return; }

  var btn = document.querySelector('.gm-btn-concluir');
  if (btn) { btn.disabled = true; btn.textContent = 'Salvando…'; }

  try {
    for (var i = 0; i < ids.length; i++) {
      var res = await _sb.from('concremtp_leroy').update(_lmPending[ids[i]]).eq('id', ids[i]);
      if (res.error) throw res.error;
    }
    _lmEditMode = false;
    _lmPending  = {};
    await carregarLeroyMerlin();
  } catch(e) {
    alert('Erro ao salvar: ' + (e.message || e));
    if (btn) { btn.disabled = false; btn.textContent = '✅ Concluir edição'; }
  }
}

async function lmRemoverItem(id) {
  if (!confirm('Remover este item da tabela?')) return;
  try {
    var res = await _sb.from('concremtp_leroy').update({ ativo: false }).eq('id', id);
    if (res.error) throw res.error;
    _lmData = _lmData.filter(function(r) { return String(r.id) !== String(id); });
    var tipoData = _lmData.filter(function(r) { return r.tipo === _lmActiveTipo; });
    var wrap = document.getElementById('lm-table-wrap');
    if (wrap) wrap.innerHTML = _lmRenderTabela(_lmFiltrar(tipoData));
  } catch(e) {
    alert('Erro ao remover: ' + (e.message || e));
  }
}

// ── IMPRESSÃO ─────────────────────────────────────────────────────────────────

function lmImprimirTodos() {
  if (!_lmData || !_lmData.length) { alert('Nenhum dado para imprimir.'); return; }

  var LOGO    = new URL('Logos/logo-cores.png', window.location.href).href;
  var dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  function pF(v) {
    var n = parseFloat(v);
    if (isNaN(n)) return '—';
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  var tipos = _lmUniq(_lmData.map(function(r) { return r.tipo; }));

  var body = '';
  tipos.forEach(function(tipo, idx) {
    var rows = _lmData.filter(function(r) { return r.tipo === tipo; });

    var trs = rows.map(function(r, i) {
      var precoConcrem = parseFloat(r.preco_concrem) || 0;
      if (typeof rjGetM === 'function') precoConcrem *= rjGetM('Leroy Merlin', 'leroy', r.linha_cor);
      var zebra = i % 2 !== 0 ? 'background:#f5f5f5;' : '';
      return '<tr>'
        + '<td style="' + zebra + '">' + _lmEsc(r.batente      || '—') + '</td>'
        + '<td style="' + zebra + '">' + _lmEsc(r.modelo       || '—') + '</td>'
        + '<td style="' + zebra + '">' + _lmEsc(r.local        || '—') + '</td>'
        + '<td style="' + zebra + '">' + _lmEsc(r.linha_cor    || '—') + '</td>'
        + '<td style="' + zebra + '">' + _lmEsc(r.largura_tipo || '—') + '</td>'
        + '<td style="text-align:right;' + zebra + '">' + pF(r.preco_leroy) + '</td>'
        + '<td style="text-align:right;font-weight:bold;color:#1a5c2a;' + zebra + '">' + pF(precoConcrem) + '</td>'
        + '<td style="text-align:right;' + zebra + '">' + pF(r.frete) + '</td>'
        + '</tr>';
    }).join('');

    body += '<div class="pblk" style="page-break-inside:avoid;break-inside:avoid">'
      + '<div class="psep">LEROY MERLIN — ' + _lmEsc(tipo.toUpperCase()) + '</div>'
      + '<table class="ppt"><thead><tr>'
      + '<th>BATENTE</th><th>MODELO</th><th>LOCAL</th>'
      + '<th>LINHA/COR</th><th>LARGURA</th>'
      + '<th>PREÇO LEROY</th><th>PREÇO CONCREM</th><th>FRETE</th>'
      + '</tr></thead>'
      + '<tbody>' + trs + '</tbody>'
      + '</table></div>';
  });

  var html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">'
    + '<title>Leroy Merlin — CONCREM</title>'
    + '<style>'
    + '* { margin:0; padding:0; box-sizing:border-box; }'
    + '@page { size:A4 portrait; margin:8mm 10mm; }'
    + 'body { font-family:Arial,sans-serif; font-size:9px; color:#1a1a1a; background:#fff; }'
    + 'table { border-collapse:collapse; }'
    + '.phdr { width:100%; margin-bottom:7px; }'
    + '.phdr td { padding:0 6px 5px; border-bottom:2.5px solid #1a5c2a; vertical-align:middle; }'
    + '.phdr-logo { width:90px; } .phdr-logo img { height:30px; }'
    + '.phdr-title { text-align:center; font-size:13px; font-weight:bold; text-transform:uppercase; }'
    + '.phdr-chan { text-align:right; font-size:11px; font-weight:bold; color:#1a5c2a; text-transform:uppercase; white-space:nowrap; }'
    + '.psep { background:#1a252f; color:#fff; font-size:9.5px; font-weight:bold; text-align:center; padding:3px 8px; margin:7px 0 3px; page-break-after:avoid; break-after:avoid; -webkit-print-color-adjust:exact; print-color-adjust:exact; }'
    + '.ppt { border-collapse:collapse; width:100%; margin-bottom:3px; }'
    + '.ppt th { background:#2c3e50; color:#fff; padding:2px 5px; text-align:center; font-size:8px; border:0.5px solid #444; -webkit-print-color-adjust:exact; print-color-adjust:exact; }'
    + '.ppt td { border:0.5px solid #ccc; padding:2px 4px; font-size:8px; vertical-align:middle; }'
    + '.pgbreak { page-break-before:always; break-before:page; }'
    + '.pblk { margin-bottom:6px; }'
    + '.pftr { margin-top:8px; border-top:1px solid #ccc; padding-top:4px; text-align:center; }'
    + '.pftr img { height:18px; opacity:.5; }'
    + '.pftr-date { font-size:7px; color:#888; margin-top:2px; }'
    + '</style></head><body>'
    + '<table class="phdr" width="100%"><tr>'
    + '<td class="phdr-logo"><img src="' + LOGO + '" alt="CONCREM"></td>'
    + '<td class="phdr-title">LEROY MERLIN — TABELA DE PREÇOS CIF</td>'
    + '<td class="phdr-chan">Canal Exclusivo</td>'
    + '</tr></table>'
    + body
    + '<div class="pftr"><img src="' + LOGO + '" alt="CONCREM"><div class="pftr-date">' + dateStr + '</div></div>'
    + '</body></html>';

  var w = window.open('', '_blank', 'width=1200,height=700');
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
