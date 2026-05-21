// ── GERENCIADOR DE ITENS DAS TABELAS ─────────────────────────────────────────
// Adicionar, editar e remover linhas/colunas. Acesso via temPermissao().
if (typeof DEMO_MODE === 'undefined') var DEMO_MODE = false;
if (typeof onAfterRender === 'undefined') window.onAfterRender = function(){};

// ── STATE ─────────────────────────────────────────────────────────────────────
var _gmDbItems   = [];
var _gmEditMode  = false;
var _gmEditSection = null;
var _gmEditChannel = null;
var _gmLoaded    = false;

var _gmAdded     = [];
var _gmRemoved   = new Set();   // Set of db IDs
var _gmNewCols   = [];          // new width columns this session

// Sections with edit support
var _GM_EDIT_SECTIONS = new Set(['portasLacca','portasUV','portasELO','laccaAcab','melamAcab','batenteELO']);
// Sections where data stores BASE prices (mult applied at render) → must divide when saving
var _GM_HASMULT = new Set(['portasELO','laccaAcab','melamAcab','batenteELO']);

// ── INIT ──────────────────────────────────────────────────────────────────────
async function gmInit() {
  if (!DEMO_MODE && _sb) {
    try {
      var res = await Promise.race([
        _sb.from('concremtp_itens_tabela').select('*').eq('ativo', true),
        new Promise(function(_, rej) { setTimeout(function() { rej(new Error('timeout')); }, 8000); }),
      ]);
      _gmDbItems = res.data || [];
    } catch(e) { _gmDbItems = []; }
  }
  _gmLoaded = true;
}

// ── WRAP rjApplyToMemory → apply DB overrides after reajuste ──────────────────
var _gmOrigRjApply = rjApplyToMemory;
rjApplyToMemory = function() {
  _gmOrigRjApply();
  if (_gmLoaded && _gmDbItems.length) _gmApplyDbOverrides();
};

function _gmApplyDbOverrides() {
  _gmDbItems.forEach(function(it) {
    try { _gmApplyItem(it); } catch(e) {}
  });
}

function _gmApplyItem(it) {
  switch (it.produto) {
    case 'portasLacca': _gmApplyPortaItem(portasLaccaData, it); break;
    case 'portasUV':    _gmApplyPortaItem(portasUVData,    it); break;
    case 'portasELO':   _gmApplyPortaEloItem(it);               break;
    case 'laccaAcab':   _gmApplyAcabItem(laccaAcabBase, it);   break;
    case 'melamAcab':   _gmApplyAcabItem(melamAcabBase, it);   break;
    case 'batenteELO':  _gmApplyBatEloItem(it);                break;
  }
}

function _gmApplyPortaItem(sectionData, it) {
  var ch = sectionData[it.canal];
  console.log('[gm] applyPortaItem — canal:', it.canal, 'ch definido:', !!ch, 'larguras:', JSON.stringify(it.larguras));
  if (!ch) return;
  if (it.tipo === 'porta' && ch.colecoes && it.larguras) {
    var col = ch.colecoes.find(function(c) { return c.nome === it.colecao; });
    if (!col) {
      col = { nome: it.colecao, sub: '', grupos: [] };
      ch.colecoes.push(col);
    }
    var grp = col.grupos.find(function(g) { return g.nome === it.acabamento; });
    if (!grp) {
      grp = { nome: it.acabamento, tipo: 'custom', itens: [] };
      col.grupos.push(grp);
    }
    var item = grp.itens.find(function(i) { return i.linha === it.linha; });
    if (item) {
      [60,70,80,90,100].forEach(function(w,i) {
        var v = it.larguras[String(w)]; if (v != null) item.p[i] = v;
      });
      item._fromDb = true; item._dbId = it.id; item._criadoEm = it.criado_em;
    } else {
      grp.itens.push({
        linha: it.linha,
        p: [60,70,80,90,100].map(function(w) {
          return it.larguras[String(w)] != null ? it.larguras[String(w)] : null;
        }),
        _fromDb: true, _dbId: it.id, _criadoEm: it.criado_em,
      });
    }
  } else if (it.tipo === 'adicional' && ch.adicionais) {
    var a = ch.adicionais.find(function(x) { return x.item === it.acabamento; });
    if (a) { if (it.preco_venda != null) a.p = it.preco_venda; a._fromDb = true; a._dbId = it.id; }
    else ch.adicionais.push({ item: it.acabamento, p: it.preco_venda || 0, _fromDb: true, _dbId: it.id });
  } else if (it.tipo === 'ferragem' && ch.ferragens) {
    var f = ch.ferragens.find(function(x) { return x.item === it.acabamento; });
    if (f) { if (it.preco_venda != null) f.p = it.preco_venda; f._fromDb = true; f._dbId = it.id; }
    else ch.ferragens.push({ item: it.acabamento, p: it.preco_venda || 0, _fromDb: true, _dbId: it.id });
  }
}

function _gmApplyPortaEloItem(it) {
  if (it.tipo !== 'porta' || !it.larguras) return;
  var col = portasELOData.colecoes.find(function(c) { return c.nome === it.colecao; });
  if (!col) {
    col = { nome: it.colecao, sub: '', grupos: [] };
    portasELOData.colecoes.push(col);
  }
  var grp = col.grupos.find(function(g) { return g.nome === it.acabamento; });
  if (!grp) {
    grp = { nome: it.acabamento, tipo: 'custom', itens: [] };
    col.grupos.push(grp);
  }
  var item = grp.itens.find(function(i) { return i.linha === it.linha; });
  if (item) {
    [60,70,80,90,100,110].forEach(function(w,i) {
      var v = it.larguras[String(w)]; if (v != null) item.p[i] = v;
    });
    item._fromDb = true; item._dbId = it.id;
  } else {
    grp.itens.push({
      linha: it.linha,
      p: [60,70,80,90,100,110].map(function(w) {
        return it.larguras[String(w)] != null ? it.larguras[String(w)] : null;
      }),
      _fromDb: true, _dbId: it.id,
    });
  }
}

function _gmApplyAcabItem(base, it) {
  // it.tipo = 'batente'|'alizar'|'rodape'
  // it.colecao = alizar variant key ('alizar9'|'alizar15') when tipo=alizar, else grupo label
  // it.linha = grupo label (e.g., '5×5', '5 cm')
  var tabKey = it.tipo === 'alizar' ? (it.colecao || 'alizar9') : it.tipo;
  var section = base[tabKey];
  if (!section || !section.grupos) return;
  var grp = section.grupos.find(function(g) { return g.label === it.linha; });
  if (!grp) {
    grp = { label: it.linha, itens: [] };
    section.grupos.push(grp);
  }
  var item = grp.itens.find(function(i) { return i.acab === it.acabamento; });
  if (item) {
    if (it.tipo === 'rodape') {
      if (it.preco_regua != null) item.precoRegua = it.preco_regua;
      if (it.preco_ml    != null) item.precoMl    = it.preco_ml;
    } else {
      if (it.preco_venda   != null) item.preco   = it.preco_venda;
      if (it.preco_protect != null) item.protect = it.preco_protect;
    }
    item._fromDb = true; item._dbId = it.id;
  } else {
    var ni = { acab: it.acabamento, _fromDb: true, _dbId: it.id };
    if (it.tipo === 'rodape') { ni.precoRegua = it.preco_regua||0; ni.precoMl = it.preco_ml||0; }
    else { ni.preco = it.preco_venda||0; ni.protect = it.preco_protect||0; }
    grp.itens.push(ni);
  }
}

function _gmApplyBatEloItem(it) {
  if (it.tipo !== 'batente') return;
  var section = eloAcabBase.batente;
  if (!section || !section.grupos) return;
  var grp = section.grupos.find(function(g) { return g.label === it.linha; });
  if (!grp) {
    grp = { label: it.linha, itens: [] };
    section.grupos.push(grp);
  }
  var item = grp.itens.find(function(i) { return i.acab === it.acabamento; });
  if (item) {
    if (it.preco_venda   != null) item.preco   = it.preco_venda;
    if (it.preco_protect != null) item.protect = it.preco_protect;
    item._fromDb = true; item._dbId = it.id;
  }
}

// ── WRAP render ───────────────────────────────────────────────────────────────
var _gmOrigRender = render;
window.render = function() {
  if (_gmEditMode && (currentSection !== _gmEditSection || currentChannel !== _gmEditChannel)) {
    _gmEditMode = false;
    _gmNewCols = [];
  }
  _gmOrigRender();
  if (!_GM_EDIT_SECTIONS.has(currentSection)) return;
  _gmAnnotateRows();
  _gmMarkDbRows();
  _gmInjectEditBtn();
  if (_gmEditMode) _gmApplyEditMode();
};

// ── EDIT BUTTON ───────────────────────────────────────────────────────────────
function _gmInjectEditBtn() {
  document.querySelectorAll('.gm-edit-btn-wrap').forEach(function(el) { el.remove(); });
  var canEdit = temPermissao('editar_itens_tabela') || temPermissao('adicionar_itens_tabela') ||
                temPermissao('remover_itens_tabela') || temPermissao('adicionar_colunas_tabela');
  if (!canEdit) return;
  var header = document.querySelector('.page-header');
  if (!header) return;
  var wrap = document.createElement('div');
  wrap.className = 'gm-edit-btn-wrap';
  if (_gmEditMode) {
    wrap.innerHTML =
      '<button class="gm-btn-concluir" onclick="gmConcluirEdicao()">✅ Concluir edição</button>' +
      '<button class="gm-btn-cancelar" onclick="gmCancelarEdicao()">✕ Cancelar</button>';
  } else {
    wrap.innerHTML = '<button class="gm-btn-edit" onclick="gmToggleEdit()">✏️ Editar tabela</button>';
  }
  header.appendChild(wrap);
}

function gmToggleEdit() {
  _gmEditMode  = true;
  _gmEditSection = currentSection;
  _gmEditChannel = currentChannel;
  _gmAdded  = [];
  _gmRemoved = new Set();
  _gmNewCols = [];
  render();
}

function gmCancelarEdicao() {
  _gmEditMode = false;
  _gmAdded = []; _gmRemoved = new Set(); _gmNewCols = [];
  render();
}

// ── ANNOTATE ROWS ─────────────────────────────────────────────────────────────
function _gmAnnotateRows() {
  var section = currentSection;
  var channel = currentChannel;
  var subtab  = (typeof subTabState !== 'undefined' && subTabState[section]) || '';

  document.querySelectorAll('.table-card, .adicional-card').forEach(function(card) {
    var titleEl = card.querySelector('.table-card-title');
    var title   = titleEl ? titleEl.textContent.trim() : '';

    var table = card.querySelector('table');
    if (!table) return;

    var ths = Array.from(table.querySelectorAll('thead th')).map(function(th) { return th.textContent.trim(); });
    var tableType = 'unknown';
    if (ths.some(function(t) { return t.includes('Protect'); }))            tableType = 'protect';
    else if (ths.some(function(t) { return t.includes('Metro Linear'); }))  tableType = 'rodape';
    else if (ths.indexOf('Linha') >= 0)                                     tableType = 'porta';
    else if (ths.indexOf('Item') >= 0 && ths.length <= 3) {
      tableType = title.toLowerCase().includes('ferragem') ? 'ferragem' : 'adicional';
    }

    card.dataset.gmTableType = tableType;
    card.dataset.gmTitle     = title;
    card.dataset.gmSubtab    = subtab;

    var tbody = table.querySelector('tbody');
    if (!tbody) return;

    var currentGrupo = '';
    tbody.querySelectorAll('tr').forEach(function(row) {
      if (row.classList.contains('acab-sep') || row.classList.contains('width-sep')) {
        var td = row.querySelector('td');
        currentGrupo = td ? td.textContent.trim() : '';
        return;
      }
      var tds = row.querySelectorAll('td');
      if (!tds.length) return;
      var raw = tds[0].textContent.trim();
      var desc = raw.replace(/^★\s*/, '');

      row.dataset.gmSection   = section;
      row.dataset.gmChannel   = channel;
      row.dataset.gmTableType = tableType;
      row.dataset.gmColecao   = title;
      row.dataset.gmGrupo     = currentGrupo;
      row.dataset.gmDesc      = desc;
      row.dataset.gmSubtab    = subtab;
    });
  });
}

// ── MARK DB ROWS WITH ★ ───────────────────────────────────────────────────────
function _gmMarkDbRows() {
  document.querySelectorAll('tr[data-gm-desc]').forEach(function(row) {
    if (!_gmIsDbRow(row)) return;
    row.dataset.gmFromDb = 'true';
    var td = row.querySelector('td');
    if (td && !td.querySelector('.gm-star')) {
      var star = document.createElement('span');
      star.className = 'gm-star';
      // Find creation date from db item
      var dbItem = _gmFindDbItemByRow(row);
      var tooltip = 'Item adicionado via sistema';
      if (dbItem && dbItem.criado_em) {
        tooltip += ' em ' + new Date(dbItem.criado_em).toLocaleDateString('pt-BR');
      }
      star.title = tooltip;
      td.insertBefore(star, td.firstChild);
    }
  });
}

function _gmIsDbRow(row) {
  return !!_gmFindDbItemByRow(row);
}

function _gmFindDbItemByRow(row) {
  return _gmFindDbItem({
    section: row.dataset.gmSection,
    channel: row.dataset.gmChannel,
    tipo:    row.dataset.gmTableType,
    subtab:  row.dataset.gmSubtab,
    colecao: row.dataset.gmColecao,
    grupo:   row.dataset.gmGrupo,
    desc:    row.dataset.gmDesc,
  });
}

function _gmFindDbItem(e) {
  return _gmDbItems.find(function(it) {
    if (it.produto !== e.section || it.canal !== e.channel) return false;
    if (e.tipo === 'porta')
      return it.tipo === 'porta' && it.colecao === e.colecao && it.acabamento === e.grupo && it.linha === e.desc;
    if (e.tipo === 'protect') {
      var st = e.subtab || '';
      if (st === 'batente' || st === 'batenteELO')
        return it.tipo === 'batente' && it.linha === e.grupo && it.acabamento === e.desc;
      if (st.startsWith('alizar'))
        return it.tipo === 'alizar' && it.colecao === st && it.linha === e.grupo && it.acabamento === e.desc;
      return (it.tipo === 'batente' || it.tipo === 'alizar') && it.linha === e.grupo && it.acabamento === e.desc;
    }
    if (e.tipo === 'rodape')
      return it.tipo === 'rodape' && it.linha === e.grupo && it.acabamento === e.desc;
    if (e.tipo === 'adicional')
      return it.tipo === 'adicional' && it.acabamento === e.desc;
    if (e.tipo === 'ferragem')
      return it.tipo === 'ferragem' && it.acabamento === e.desc;
    return false;
  });
}

// ── APPLY EDIT MODE ───────────────────────────────────────────────────────────
function _gmApplyEditMode() {
  // Add delete-column header to tables
  document.querySelectorAll('.table-card table, .adicional-card table').forEach(function(table) {
    var thead = table.querySelector('thead tr');
    if (thead && !thead.querySelector('.gm-del-th') && temPermissao('remover_itens_tabela')) {
      var th = document.createElement('th');
      th.className = 'gm-del-th';
      th.style.cssText = 'width:36px;padding:0';
      thead.appendChild(th);
    }
  });

  // Transform data rows
  document.querySelectorAll('tr[data-gm-desc]').forEach(function(row) {
    _gmTransformRow(row);
  });

  // Column button + new row per card
  document.querySelectorAll('.table-card, .adicional-card').forEach(function(card) {
    var tt = card.dataset.gmTableType;
    if (!tt || tt === 'unknown') return;
    if (tt === 'porta' && temPermissao('adicionar_colunas_tabela')) _gmAddColumnBtn(card);
    if (temPermissao('adicionar_itens_tabela')) _gmAddNewRowBtn(card);
  });
}

function _gmTransformRow(row) {
  if (row.classList.contains('gm-new-row')) return;
  var tt = row.dataset.gmTableType;
  var tds = row.querySelectorAll('td');
  if (!tds.length) return;

  // Delete button
  if (temPermissao('remover_itens_tabela') && !row.querySelector('.gm-btn-del')) {
    var delTd = document.createElement('td');
    delTd.style.cssText = 'width:36px;padding:2px;text-align:center';
    var removed = row.classList.contains('gm-removed');
    delTd.innerHTML = '<button class="gm-btn-del' + (removed ? ' gm-btn-del-undo' : '') +
      '" onclick="gmToggleRemove(this)" title="' + (removed ? 'Desfazer remoção' : 'Remover linha') + '">' +
      (removed ? '↩' : '🗑') + '</button>';
    row.appendChild(delTd);
  }

  if (row.classList.contains('gm-removed')) return;
  if (!temPermissao('editar_itens_tabela')) return;

  if (tt === 'porta') {
    // Ler larguras do cabeçalho para marcar cada input com data-col-w
    var thead = row.closest('table') && row.closest('table').querySelector('thead tr');
    var thArr  = thead ? Array.from(thead.querySelectorAll('th')) : [];
    for (var i = 1; i < tds.length; i++) {
      var td = tds[i];
      if (td.classList.contains('dash') || td.textContent.trim() === '—' ||
          td.querySelector('.gm-btn-del')) continue;
      var v = _gmParsePrice(td.textContent);
      // Extrair número da largura do <th> correspondente (ex: "60 CM" → "60")
      var colWAttr = '';
      if (thArr[i]) {
        var m = thArr[i].textContent.trim().match(/(\d+)/);
        if (m) colWAttr = ' data-col-w="' + m[1] + '"';
      }
      td.innerHTML = '<input type="number" class="gm-price-input" min="0" step="0.01"' +
        ' value="' + v.toFixed(2) + '" data-orig="' + v.toFixed(2) + '"' + colWAttr + '>';
      td.classList.add('gm-editing');
    }
  } else if (tt === 'protect') {
    [1, 2].forEach(function(i) {
      var td = tds[i];
      if (!td || td.querySelector('.gm-btn-del')) return;
      var v = _gmParsePrice(td.textContent);
      td.innerHTML = '<input type="number" class="gm-price-input" min="0" step="0.01"' +
        ' value="' + v.toFixed(2) + '" data-orig="' + v.toFixed(2) + '">';
      td.classList.add('gm-editing');
    });
  } else if (tt === 'rodape') {
    [1, 2].forEach(function(i) {
      var td = tds[i];
      if (!td || td.querySelector('.gm-btn-del')) return;
      var v = _gmParsePrice(td.textContent);
      td.innerHTML = '<input type="number" class="gm-price-input" min="0" step="0.01"' +
        ' value="' + v.toFixed(2) + '" data-orig="' + v.toFixed(2) + '">';
      td.classList.add('gm-editing');
    });
  } else if (tt === 'adicional' || tt === 'ferragem') {
    var td1 = tds[1];
    if (td1 && !td1.querySelector('.gm-btn-del')) {
      var v = _gmParsePrice(td1.textContent);
      td1.innerHTML = '<input type="number" class="gm-price-input" min="0" step="0.01"' +
        ' value="' + v.toFixed(2) + '" data-orig="' + v.toFixed(2) + '">';
      td1.classList.add('gm-editing');
    }
  }
}

// ── TOGGLE REMOVE ─────────────────────────────────────────────────────────────
function gmToggleRemove(btn) {
  if (!temPermissao('remover_itens_tabela')) return;
  var row = btn.closest('tr');
  if (!row) return;
  row.classList.toggle('gm-removed');
  var isRemoved = row.classList.contains('gm-removed');

  // Swap delete button icon
  btn.textContent = isRemoved ? '↩' : '🗑';
  btn.title = isRemoved ? 'Desfazer remoção' : 'Remover linha';
  btn.classList.toggle('gm-btn-del-undo', isRemoved);

  if (isRemoved) {
    // Remove inputs → show formatted text
    row.querySelectorAll('td.gm-editing').forEach(function(td) {
      var inp = td.querySelector('input');
      if (inp) { td.textContent = fmt(parseFloat(inp.value) || 0); }
      td.classList.remove('gm-editing');
    });
  } else {
    // Re-add inputs
    _gmTransformRow(row);
  }
}

// ── ADD COLUMN BUTTON ─────────────────────────────────────────────────────────
function _gmAddColumnBtn(card) {
  var theadRow = card.querySelector('thead tr');
  if (!theadRow || theadRow.querySelector('.gm-add-col-th')) return;
  var th = document.createElement('th');
  th.className = 'gm-add-col-th';
  th.innerHTML = '<button class="gm-btn-add-col" onclick="gmAddColumn(this)">+ Largura</button>';
  // Insert before delete-header if present
  var delTh = theadRow.querySelector('.gm-del-th');
  if (delTh) theadRow.insertBefore(th, delTh);
  else theadRow.appendChild(th);

  // Add placeholder td to each data row
  card.querySelectorAll('tr[data-gm-desc]').forEach(function(row) {
    if (row.classList.contains('gm-removed')) return;
    var td = document.createElement('td');
    td.className = 'gm-new-col-td gm-editing';
    td.innerHTML = '<input type="number" class="gm-price-input gm-nc-input" min="0" step="0.01" placeholder="—">';
    var delTd = row.querySelector('td:last-child');
    if (delTd && delTd.querySelector('.gm-btn-del')) row.insertBefore(td, delTd);
    else row.appendChild(td);
  });
}

function gmAddColumn(btn) {
  var card = btn.closest('.table-card');
  if (!card) return;
  var inp = prompt('Nova largura (cm) — somente número (ex: 110):');
  if (inp === null) return;
  var w = parseInt(inp, 10);
  if (isNaN(w) || w <= 0) { _gmToast('Largura inválida.', true); return; }

  var existing = Array.from(card.querySelectorAll('thead th'))
    .map(function(th) { return parseInt(th.textContent); })
    .filter(function(n) { return !isNaN(n); });
  if (existing.indexOf(w) >= 0) { _gmToast('Largura ' + w + ' cm já existe.', true); return; }

  if (_gmNewCols.indexOf(w) < 0) _gmNewCols.push(w);

  // Label the free inputs
  var theadRow = card.querySelector('thead tr');
  var th = btn.closest('th');
  th.textContent = w + ' cm';
  th.className = 'th-price gm-new-col-header';

  // Each data row: label free nc-input with this width
  card.querySelectorAll('tr[data-gm-desc]').forEach(function(row) {
    var freeInp = row.querySelector('.gm-nc-input:not([data-col-w])');
    if (freeInp) { freeInp.dataset.colW = String(w); freeInp.placeholder = '0.00'; }
  });

  // Add another placeholder column
  var delTh = theadRow.querySelector('.gm-del-th');
  var newTh = document.createElement('th');
  newTh.className = 'gm-add-col-th';
  newTh.innerHTML = '<button class="gm-btn-add-col" onclick="gmAddColumn(this)">+ Largura</button>';
  if (delTh) theadRow.insertBefore(newTh, delTh);
  else theadRow.appendChild(newTh);

  card.querySelectorAll('tr[data-gm-desc]').forEach(function(row) {
    if (row.classList.contains('gm-removed')) return;
    var td = document.createElement('td');
    td.className = 'gm-new-col-td gm-editing';
    td.innerHTML = '<input type="number" class="gm-price-input gm-nc-input" min="0" step="0.01" placeholder="—">';
    var delTd = row.querySelector('td:last-child');
    if (delTd && delTd.querySelector('.gm-btn-del')) row.insertBefore(td, delTd);
    else row.appendChild(td);
  });

  _gmToast('Coluna ' + w + ' cm adicionada. Preencha os preços e salve.');
}

// ── ADD ROW BUTTON (abre drawer) ──────────────────────────────────────────────
function _gmAddNewRowBtn(card) {
  if (card.querySelector('.gm-add-row-btn-wrap')) return;
  var wrap = document.createElement('div');
  wrap.className = 'gm-add-row-btn-wrap';
  wrap.innerHTML = '<button class="gm-add-row-btn" onclick="gmOpenDrawer(this.closest(\'.table-card\') || this.closest(\'.adicional-card\'))">＋ Adicionar linha</button>';
  card.appendChild(wrap);
}

// ── DRAWER ────────────────────────────────────────────────────────────────────
var _gmDrawerCard = null;

function gmOpenDrawer(card) {
  _gmDrawerCard = card;
  var tt = card.dataset.gmTableType;
  var typeLabels = { porta: 'linha de porta', protect: 'acabamento', rodape: 'rodapé', adicional: 'adicional', ferragem: 'ferragem' };
  var title = 'Adicionar ' + (typeLabels[tt] || 'item');

  var overlay = document.getElementById('gm-drawer-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gm-drawer-overlay';
    overlay.className = 'gm-drawer-overlay';
    overlay.addEventListener('click', function(e) { if (e.target === overlay) gmCloseDrawer(); });
    document.body.appendChild(overlay);
  }

  overlay.innerHTML =
    '<div class="gm-drawer" id="gm-drawer">' +
      '<div class="gm-drawer-header">' +
        '<span class="gm-drawer-title">' + title + '</span>' +
        '<button class="gm-drawer-close" onclick="gmCloseDrawer()">✕</button>' +
      '</div>' +
      '<div class="gm-drawer-body" id="gm-drawer-body">' +
        _gmDrawerBodyHtml(card, tt) +
      '</div>' +
      '<div class="gm-drawer-footer">' +
        '<button class="gm-drawer-cancel" onclick="gmCloseDrawer()">Cancelar</button>' +
        '<button class="gm-drawer-submit" onclick="gmSubmitDrawer()">Adicionar</button>' +
      '</div>' +
    '</div>';

  overlay.querySelector('#gm-drawer').addEventListener('click', function(e) { e.stopPropagation(); });

  requestAnimationFrame(function() { overlay.classList.add('gm-drawer-open'); });
}

function _gmDrawerBodyHtml(card, tt) {
  if (tt === 'porta') {
    var table    = card.querySelector('table');
    var theadRow = table && table.querySelector('thead tr');
    var ths      = theadRow ? Array.from(theadRow.querySelectorAll('th')) : [];
    var widthThs = ths.filter(function(th) {
      return !th.classList.contains('gm-add-col-th') && !th.classList.contains('gm-del-th') && th.textContent.includes('cm');
    });
    var colecoes = _gmGetColecoes();
    var colSelOpts = '<option value="">Selecione a coleção…</option>' +
      colecoes.map(function(c) { return '<option value="' + _gmEsc(c) + '">' + _gmEsc(c) + '</option>'; }).join('');
    var priceHtml = widthThs.map(function(th) {
      var wKey = th.textContent.replace(' cm','').trim();
      return '<div class="gm-drawer-field gm-drawer-field-price">' +
        '<label class="gm-drawer-label">' + wKey + ' cm</label>' +
        '<input type="number" class="gm-drawer-input gm-new-price" data-width="' + wKey + '" min="0" step="0.01" placeholder="0.00">' +
        '</div>';
    }).join('');
    return '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Coleção</label>' +
        '<select class="gm-drawer-input gm-inp-colecao" onchange="gmUpdateGruposDrawer(this)">' + colSelOpts + '</select>' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Acabamento (grupo)</label>' +
        '<select class="gm-drawer-input gm-inp-grupo" id="gm-sl-grp-drawer"><option value="">Selecione a coleção primeiro…</option></select>' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Nome da linha</label>' +
        '<input class="gm-drawer-input gm-inp-linha" placeholder="Ex: COLMEIA — SARRAFO 3mm">' +
      '</div>' +
      '<div class="gm-drawer-section-title">Preços por largura</div>' +
      '<div class="gm-drawer-prices">' + priceHtml + '</div>';
  }

  if (tt === 'protect') {
    var grupos = _gmGetGruposFromCard(card);
    var grpSelOpts = '<option value="">Selecione o grupo…</option>' +
      grupos.map(function(g) { return '<option value="' + _gmEsc(g) + '">' + _gmEsc(g) + '</option>'; }).join('');
    return '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Grupo / Espessura</label>' +
        '<select class="gm-drawer-input gm-inp-grupo">' + grpSelOpts + '</select>' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Acabamento</label>' +
        '<input class="gm-drawer-input gm-inp-acab" placeholder="Ex: ELO BRANCO">' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Preço de venda</label>' +
        '<input type="number" class="gm-drawer-input gm-np-preco" min="0" step="0.01" placeholder="0.00">' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Com Protect+</label>' +
        '<input type="number" class="gm-drawer-input gm-np-protect" min="0" step="0.01" placeholder="0.00">' +
      '</div>';
  }

  if (tt === 'rodape') {
    var grupos = _gmGetGruposFromCard(card);
    var grpSelOpts = '<option value="">Selecione o grupo…</option>' +
      grupos.map(function(g) { return '<option value="' + _gmEsc(g) + '">' + _gmEsc(g) + '</option>'; }).join('');
    return '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Grupo / Espessura</label>' +
        '<select class="gm-drawer-input gm-inp-grupo">' + grpSelOpts + '</select>' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Acabamento</label>' +
        '<input class="gm-drawer-input gm-inp-acab" placeholder="Ex: ELO BRANCO">' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Preço régua</label>' +
        '<input type="number" class="gm-drawer-input gm-np-regua" min="0" step="0.01" placeholder="0.00">' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Preço metro linear</label>' +
        '<input type="number" class="gm-drawer-input gm-np-ml" min="0" step="0.01" placeholder="0.00">' +
      '</div>';
  }

  if (tt === 'adicional' || tt === 'ferragem') {
    return '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Descrição</label>' +
        '<input class="gm-drawer-input gm-inp-desc" placeholder="Descrição do item">' +
      '</div>' +
      '<div class="gm-drawer-field">' +
        '<label class="gm-drawer-label">Preço</label>' +
        '<input type="number" class="gm-drawer-input gm-np-preco" min="0" step="0.01" placeholder="0.00">' +
      '</div>';
  }
  return '';
}

function gmUpdateGruposDrawer(sel) {
  var colNome = sel.value;
  var grpSel  = document.getElementById('gm-sl-grp-drawer');
  if (!grpSel) return;
  var s = currentSection, ch = currentChannel;
  var sd = null;
  if (s === 'portasLacca') sd = portasLaccaData[ch] || portasLaccaData.distribuidora;
  else if (s === 'portasUV') sd = portasUVData[ch] || portasUVData.distribuidora;
  else if (s === 'portasELO') sd = portasELOData;
  if (!sd || !sd.colecoes) return;
  var col = sd.colecoes.find(function(c) { return c.nome === colNome; });
  grpSel.innerHTML = col
    ? '<option value="">Selecione o acabamento…</option>' +
      col.grupos.map(function(g) { return '<option value="' + _gmEsc(g.nome) + '">' + _gmEsc(g.nome) + '</option>'; }).join('')
    : '<option value="">Selecione a coleção primeiro…</option>';
}

function _gmGetGruposFromCard(card) {
  var grupos = [];
  card.querySelectorAll('tbody tr.width-sep td, tbody tr.acab-sep td').forEach(function(td) {
    var t = td.textContent.trim();
    if (t && grupos.indexOf(t) < 0) grupos.push(t);
  });
  return grupos;
}

function gmCloseDrawer() {
  var overlay = document.getElementById('gm-drawer-overlay');
  if (!overlay) return;
  overlay.classList.remove('gm-drawer-open');
  setTimeout(function() {
    if (overlay && overlay.parentNode) overlay.innerHTML = '';
  }, 300);
  _gmDrawerCard = null;
}

function gmSubmitDrawer() {
  var card = _gmDrawerCard;
  var body = document.getElementById('gm-drawer-body');
  if (!card || !body) return;

  var tt      = card.dataset.gmTableType;
  var subtab  = card.dataset.gmSubtab || '';
  var hasMult = _GM_HASMULT.has(currentSection);
  var mult    = CHANNELS[currentChannel].mult;

  var item = {
    produto: currentSection, canal: currentChannel, ativo: true, _isNew: true,
    larguras: {}, preco_venda: null, preco_protect: null, preco_regua: null, preco_ml: null,
  };

  if (tt === 'porta') {
    var colInp   = body.querySelector('.gm-inp-colecao');
    var grupoInp = body.querySelector('.gm-inp-grupo');
    var linhaInp = body.querySelector('.gm-inp-linha');
    if (!colInp   || !colInp.value.trim())  { _gmToast('Digite ou selecione a coleção.', true); return; }
    if (!grupoInp || !grupoInp.value.trim()) { _gmToast('Digite ou selecione o acabamento.', true); return; }
    if (!linhaInp || !linhaInp.value.trim()) { _gmToast('Digite o nome da linha.', true); return; }
    item.tipo = 'porta'; item.colecao = colInp.value.trim(); item.acabamento = grupoInp.value.trim(); item.linha = linhaInp.value.trim();
    body.querySelectorAll('.gm-new-price').forEach(function(pi) {
      var v = parseFloat(pi.value);
      if (!isNaN(v) && v > 0) item.larguras[pi.dataset.width] = hasMult ? +(v/mult).toFixed(4) : v;
    });

  } else if (tt === 'protect') {
    var grupoInp = body.querySelector('.gm-inp-grupo');
    var acabInp  = body.querySelector('.gm-inp-acab');
    if (!acabInp || !acabInp.value.trim()) { _gmToast('Digite o acabamento.', true); return; }
    var p1 = body.querySelector('.gm-np-preco');
    var p2 = body.querySelector('.gm-np-protect');
    if (subtab.startsWith('alizar')) { item.tipo = 'alizar'; item.colecao = subtab; }
    else { item.tipo = 'batente'; item.colecao = null; }
    item.linha      = grupoInp ? grupoInp.value.trim() : '';
    item.acabamento = acabInp.value.trim();
    if (p1) item.preco_venda   = +(parseFloat(p1.value || 0) / (hasMult ? mult : 1)).toFixed(4);
    if (p2) item.preco_protect = +(parseFloat(p2.value || 0) / (hasMult ? mult : 1)).toFixed(4);

  } else if (tt === 'rodape') {
    var grupoInp = body.querySelector('.gm-inp-grupo');
    var acabInp  = body.querySelector('.gm-inp-acab');
    if (!acabInp || !acabInp.value.trim()) { _gmToast('Digite o acabamento.', true); return; }
    var p1 = body.querySelector('.gm-np-regua');
    var p2 = body.querySelector('.gm-np-ml');
    item.tipo = 'rodape'; item.colecao = null;
    item.linha      = grupoInp ? grupoInp.value.trim() : '';
    item.acabamento = acabInp.value.trim();
    if (p1) item.preco_regua = +(parseFloat(p1.value || 0) / (hasMult ? mult : 1)).toFixed(4);
    if (p2) item.preco_ml   = +(parseFloat(p2.value || 0) / (hasMult ? mult : 1)).toFixed(4);

  } else if (tt === 'adicional' || tt === 'ferragem') {
    var descInp  = body.querySelector('.gm-inp-desc');
    var precoInp = body.querySelector('.gm-np-preco');
    if (!descInp || !descInp.value.trim()) { _gmToast('Digite a descrição.', true); return; }
    item.tipo = tt; item.colecao = null; item.linha = null;
    item.acabamento  = descInp.value.trim();
    item.preco_venda = parseFloat(precoInp && precoInp.value || 0) || 0;
  }

  _gmAdded.push(item);
  gmCloseDrawer();
  _gmToast('Linha adicionada. Clique em "Concluir edição" para salvar.');
}

function _gmGetColecoes() {
  var s = currentSection, ch = currentChannel;
  var sd = null;
  if (s === 'portasLacca') sd = portasLaccaData[ch] || portasLaccaData.distribuidora;
  else if (s === 'portasUV') sd = portasUVData[ch] || portasUVData.distribuidora;
  else if (s === 'portasELO') sd = portasELOData;
  if (!sd || !sd.colecoes) return [];
  return sd.colecoes.map(function(c) { return c.nome; });
}

// ── COLLECT CHANGES ───────────────────────────────────────────────────────────
function _gmCollectChanges() {
  var hasMult = _GM_HASMULT.has(currentSection);
  var mult    = CHANNELS[currentChannel].mult;
  var edited  = [];
  var removed = [];

  document.querySelectorAll('tr[data-gm-desc]').forEach(function(row) {
    if (row.classList.contains('gm-new-row')) return;

    if (row.classList.contains('gm-removed')) {
      removed.push({
        section: row.dataset.gmSection, channel: row.dataset.gmChannel,
        tipo:    row.dataset.gmTableType, subtab:  row.dataset.gmSubtab,
        colecao: row.dataset.gmColecao, grupo: row.dataset.gmGrupo, desc: row.dataset.gmDesc,
      });
      return;
    }

    var inputs = row.querySelectorAll('.gm-price-input');
    if (!inputs.length) return;
    var anyChanged = Array.from(inputs).some(function(inp) {
      return Math.abs(parseFloat(inp.value) - parseFloat(inp.dataset.orig || inp.value)) > 0.001;
    });
    if (!anyChanged && !row.querySelectorAll('.gm-nc-input[data-col-w]').length) return;

    var tt = row.dataset.gmTableType;
    var changes = {};

    if (tt === 'porta') {
      var thead = row.closest('table').querySelector('thead tr');
      var thArr  = thead ? Array.from(thead.querySelectorAll('th')).slice(1) : [];
      var larguras = {};
      var larguras_antes = {};
      var normalInputs = Array.from(row.querySelectorAll('.gm-price-input:not(.gm-nc-input)'));
      normalInputs.forEach(function(inp, i) {
        var th = thArr[i];
        if (!th) return;
        var wStr = th.textContent.replace(' cm','').trim();
        var w = parseInt(wStr);
        if (!isNaN(w)) {
          var v    = parseFloat(inp.value);
          var vOld = parseFloat(inp.dataset.orig || inp.value);
          if (!isNaN(v))    larguras[String(w)]       = hasMult ? +(v/mult).toFixed(4) : v;
          if (!isNaN(vOld)) larguras_antes[String(w)] = hasMult ? +(vOld/mult).toFixed(4) : vOld;
        }
      });
      // New columns
      row.querySelectorAll('.gm-nc-input[data-col-w]').forEach(function(inp) {
        var v = parseFloat(inp.value);
        if (inp.dataset.colW && !isNaN(v) && v > 0)
          larguras[inp.dataset.colW] = hasMult ? +(v/mult).toFixed(4) : v;
      });
      if (Object.keys(larguras).length) {
        changes.larguras       = larguras;
        changes.larguras_antes = larguras_antes;
      }
    } else if (tt === 'protect') {
      var inps = row.querySelectorAll('.gm-price-input');
      if (inps[0]) changes.preco_venda   = +(parseFloat(inps[0].value) / (hasMult ? mult : 1)).toFixed(4);
      if (inps[1]) changes.preco_protect = +(parseFloat(inps[1].value) / (hasMult ? mult : 1)).toFixed(4);
    } else if (tt === 'rodape') {
      var inps = row.querySelectorAll('.gm-price-input');
      if (inps[0]) changes.preco_regua = +(parseFloat(inps[0].value) / (hasMult ? mult : 1)).toFixed(4);
      if (inps[1]) changes.preco_ml   = +(parseFloat(inps[1].value) / (hasMult ? mult : 1)).toFixed(4);
    } else if (tt === 'adicional' || tt === 'ferragem') {
      var inps = row.querySelectorAll('.gm-price-input');
      if (inps[0]) changes.preco_venda = parseFloat(inps[0].value) || 0;
    }

    if (Object.keys(changes).length) {
      edited.push({
        section: row.dataset.gmSection, channel: row.dataset.gmChannel,
        tipo:    row.dataset.gmTableType, subtab:  row.dataset.gmSubtab,
        colecao: row.dataset.gmColecao, grupo: row.dataset.gmGrupo, desc: row.dataset.gmDesc,
        changes: changes,
      });
    }
  });

  return { added: _gmAdded.slice(), edited: edited, removed: removed };
}

// ── CONCLUIR → MODAL DE CONFIRMAÇÃO ──────────────────────────────────────────
function gmConcluirEdicao() {
  var payload = _gmCollectChanges();
  var total = payload.added.length + payload.edited.length + payload.removed.length;
  if (total === 0 && _gmNewCols.length === 0) { _gmToast('Nenhuma alteração detectada.'); return; }
  _gmShowConfirmModal(payload);
}

function _gmShowConfirmModal(payload) {
  var old = document.getElementById('gm-confirm-modal');
  if (old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'gm-confirm-modal';
  modal.className = 'gm-modal-overlay';

  var demoNote = DEMO_MODE
    ? '<div class="gm-demo-notice">Modo demo — alterações ficam apenas na memória. Conecte ao Supabase para persistir.</div>'
    : '';

  modal.innerHTML =
    '<div class="gm-modal">' +
      '<div class="gm-modal-header">' +
        '<span class="gm-modal-title">Confirmar alterações</span>' +
        '<button class="gm-modal-close" onclick="document.getElementById(\'gm-confirm-modal\').remove()">✕</button>' +
      '</div>' +
      '<div class="gm-modal-body">' +
        '<p class="gm-modal-summary">' +
          '<b>' + payload.added.length + '</b> linha(s) adicionada(s) &nbsp;·&nbsp; ' +
          '<b>' + payload.edited.length + '</b> editada(s) &nbsp;·&nbsp; ' +
          '<b>' + payload.removed.length + '</b> removida(s)' +
          (_gmNewCols.length ? ' &nbsp;·&nbsp; <b>' + _gmNewCols.length + '</b> coluna(s) nova(s)' : '') +
        '</p>' + demoNote +
      '</div>' +
      '<div class="gm-modal-footer">' +
        '<button class="gm-modal-btn-cancel" onclick="document.getElementById(\'gm-confirm-modal\').remove()">Cancelar</button>' +
        '<button class="gm-modal-btn-confirm" onclick="gmExecuteSave()">Salvar</button>' +
      '</div>' +
    '</div>';

  modal.dataset.payload = JSON.stringify(payload);
  document.body.appendChild(modal);
}

// ── EXECUTE SAVE ──────────────────────────────────────────────────────────────
async function gmExecuteSave() {
  var modal = document.getElementById('gm-confirm-modal');
  if (!modal) return;
  var payload;
  try { payload = JSON.parse(modal.dataset.payload); } catch(e) { return; }
  modal.remove();

  if (DEMO_MODE) {
    // Demo: apply to local state
    payload.added.forEach(function(it) {
      _gmDbItems.push(Object.assign({ id: 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2) }, it, { _isNew: undefined }));
    });
    payload.edited.forEach(function(e) {
      var item = _gmFindDbItem(e);
      if (item) {
        Object.assign(item, e.changes);
      } else {
        // Hardcoded item edited → create demo DB entry
        var ni = _gmBuildDbRow(e, null, null);
        ni.id = 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2);
        Object.assign(ni, e.changes);
        _gmDbItems.push(ni);
      }
    });
    payload.removed.forEach(function(r) {
      var item = _gmFindDbItem(r);
      if (item) { item.ativo = false; }
    });
    _gmDbItems = _gmDbItems.filter(function(it) { return it.ativo !== false; });
    _gmEditMode = false; _gmAdded = []; _gmRemoved = new Set(); _gmNewCols = [];
    render();
    _gmToast('Tabela atualizada! (modo demo — não persistido)');
    return;
  }

  // Supabase
  try {
    var ops = [];
    var ts  = new Date().toISOString();
    var uid = currentUser && currentUser.id;

    if (payload.added.length) {
      var rows = payload.added.map(function(it) {
        var r = Object.assign({}, it);
        delete r._isNew; delete r._fromDb; delete r._dbId; delete r._criadoEm;
        r.criado_por = uid; r.criado_em = ts; r.ativo = true;
        if (!r.larguras) r.larguras = {};
        return r;
      });
      ops.push(_sb.from('concremtp_itens_tabela').insert(rows));
    }

    payload.edited.forEach(function(e) {
      var existing = _gmFindDbItem(e);
      if (existing && existing.id) {
        var upd = Object.assign({}, e.changes, { editado_em: ts, editado_por: uid });
        ops.push(_sb.from('concremtp_itens_tabela').update(upd).eq('id', existing.id));
      } else {
        // No DB record yet → INSERT (hardcoded item being overridden)
        var newRow = _gmBuildDbRow(e, uid, ts);
        Object.assign(newRow, e.changes);
        ops.push(_sb.from('concremtp_itens_tabela').insert(newRow));
      }
    });

    payload.removed.forEach(function(r) {
      var existing = _gmFindDbItem(r);
      if (existing && existing.id)
        ops.push(_sb.from('concremtp_itens_tabela').update({ ativo: false, editado_em: ts, editado_por: uid }).eq('id', existing.id));
    });

    await Promise.all(ops);

    // ── Audit log ─────────────────────────────────────────
    try {
      var detalhes = [];
      if (payload.added.length)   detalhes.push(payload.added.length   + ' linha(s) adicionada(s)');
      if (payload.edited.length)  detalhes.push(payload.edited.length  + ' linha(s) editada(s)');
      if (payload.removed.length) detalhes.push(payload.removed.length + ' linha(s) removida(s)');
      if (_gmNewCols.length)      detalhes.push(_gmNewCols.length + ' coluna(s) adicionada(s): ' + _gmNewCols.join(', ') + ' cm');

      var auditEntry = {
        data_hora:  ts,
        usuario_id: uid || null,
        usuario_nome: (window.currentUser && window.currentUser.nome) || null,
        produto:    _gmEditSection || null,
        canal:      _gmEditChannel || null,
        acao:       'edicao_tabela',
        detalhes:   detalhes.join(' · '),
        adicionados: payload.added.length,
        editados:    payload.edited.length,
        removidos:   payload.removed.length,
      };
      await _sb.from('concremtp_audit_tabelas').insert(auditEntry);
    } catch(auditErr) {
      console.warn('[gerenciador] audit log falhou (não crítico):', auditErr.message);
    }

    // ── Registrar no Histórico de Reajustes ───────────────
    try {
      var PROD_LABEL = {
        portasLacca: 'Portas LACCA', portasUV: 'Portas UV Melamínico',
        portasELO: 'Portas ELO', laccaAcab: 'Batente & Alizar LACCA',
        melamAcab: 'Batente & Alizar Melamínico', batenteELO: 'Batente & Alizar ELO',
      };
      var prodLabel = PROD_LABEL[_gmEditSection] || _gmEditSection;

      for (var ei = 0; ei < payload.edited.length; ei++) {
        var e = payload.edited[ei];
        if (e.tipo !== 'porta' || !e.changes.larguras) continue;

        var larg    = e.changes.larguras;
        var largAnt = e.changes.larguras_antes || {};

        // Snapshot apenas das larguras que mudaram, no formato {grupo, linha, antes, depois}
        var snapshot = [];
        var pctTotal = 0; var pctCount = 0;
        Object.keys(larg).sort(function(a,b){return +a - +b;}).forEach(function(w) {
          var antes  = largAnt[w] != null ? largAnt[w] : null;
          var depois = larg[w];
          var mudou  = antes == null || Math.abs(depois - antes) > 0.001;
          if (mudou) {
            snapshot.push({
              grupo:  e.colecao + ' — ' + e.grupo,
              linha:  e.desc + ' — ' + w + ' cm',
              antes:  antes,
              depois: depois,
            });
            if (antes && antes > 0) {
              pctTotal += ((depois - antes) / antes) * 100;
              pctCount++;
            }
          }
        });

        if (!snapshot.length) continue; // nada mudou de fato

        var pct         = pctCount > 0 ? +(pctTotal / pctCount).toFixed(2) : 0;
        var sampleAntes = largAnt['60'] != null ? largAnt['60']
                        : largAnt[Object.keys(largAnt)[0]] || null;

        var histEntry = {
          id:             Date.now().toString() + '-' + ei,
          produto:        prodLabel,
          canal:          e.channel,
          linha:          e.desc,
          porcentagem:    pct,
          motivo:         'Edição manual — ' + e.colecao + ' / ' + e.grupo,
          dataHora:       ts,
          precosAntes:    largAnt,
          sampleAntes:    sampleAntes,
          linhasSnapshot: snapshot,
        };

        var d = rjLoad();
        d.historico.push(histEntry);
        rjSave(d);
        if (typeof _rjSbInsertReajuste === 'function') _rjSbInsertReajuste(histEntry);
      }
    } catch(histErr) {
      console.warn('[gerenciador] histórico de reajustes falhou (não crítico):', histErr.message);
    }

    var res = await _sb.from('concremtp_itens_tabela').select('*').eq('ativo', true);
    _gmDbItems = res.data || [];
    _gmEditMode = false; _gmAdded = []; _gmRemoved = new Set(); _gmNewCols = [];
    render();
    _gmToast('Tabela atualizada com sucesso!');

  } catch(e) {
    var msg = e.message || String(e);
    var detalhe = msg.includes('403') || msg.includes('Forbidden')
      ? 'Sem permissão de escrita (403). Execute o SQL de liberação de RLS no Supabase.'
      : msg;
    console.error('[gerenciador] Erro ao salvar:', e);
    // Mostrar erro em modal persistente (não some como toast)
    var errModal = document.createElement('div');
    errModal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center';
    errModal.innerHTML = '<div style="background:#fff;border-radius:12px;padding:28px 32px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3)">'
      + '<p style="font-weight:700;font-size:16px;color:#dc2626;margin-bottom:8px">❌ Erro ao salvar</p>'
      + '<p style="font-size:13px;color:#374151;margin-bottom:20px">' + detalhe + '</p>'
      + '<button onclick="this.closest(\'div[style]\').remove()" style="background:#dc2626;color:#fff;border:none;border-radius:8px;padding:9px 20px;cursor:pointer;font-weight:600">Fechar</button>'
      + '</div>';
    document.body.appendChild(errModal);
  }
}

// ── BUILD DB ROW FROM EDIT DESCRIPTOR ────────────────────────────────────────
function _gmBuildDbRow(e, uid, ts) {
  var tipo, colecao;
  if (e.tipo === 'protect') {
    var st = e.subtab || '';
    if (st.startsWith('alizar')) { tipo = 'alizar'; colecao = st; }
    else { tipo = 'batente'; colecao = e.colecao || null; }
  } else if (e.tipo === 'rodape') {
    tipo = 'rodape'; colecao = null;
  } else {
    tipo = e.tipo; colecao = e.colecao || null;
  }
  return {
    produto: e.section, canal: e.channel, tipo: tipo,
    colecao: colecao, linha: e.desc || null, acabamento: e.grupo || null,
    larguras: {}, preco_venda: null, preco_protect: null, preco_regua: null, preco_ml: null,
    ativo: true, criado_por: uid || null, criado_em: ts || new Date().toISOString(),
  };
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
var _gmToastEl = null, _gmToastTimer = null;
function _gmToast(msg, isError) {
  if (!_gmToastEl) {
    _gmToastEl = document.createElement('div');
    _gmToastEl.id = 'gm-toast';
    document.body.appendChild(_gmToastEl);
  }
  _gmToastEl.textContent  = msg;
  _gmToastEl.className    = 'gm-toast gm-toast-show ' + (isError ? 'gm-toast-error' : 'gm-toast-ok');
  clearTimeout(_gmToastTimer);
  _gmToastTimer = setTimeout(function() { if (_gmToastEl) _gmToastEl.className = 'gm-toast'; }, 3500);
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
function _gmParsePrice(txt) {
  return parseFloat(String(txt || '').replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
}

function _gmEsc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── WRAP initApp ──────────────────────────────────────────────────────────────
var _gmOrigInitApp = initApp;
window.initApp = function() {
  gmInit().then(function() { _gmOrigInitApp(); });
};
