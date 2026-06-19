// ── UTILS ────────────────────────────────────────────
function fmt(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcPrice(base) {
  return base * CHANNELS[currentChannel].mult;
}

// ── SEARCH ────────────────────────────────────────────
function onSearch(val) {
  searchTerm = val;
  applySearch();
}

function applySearch() {
  const term = searchTerm.toLowerCase().trim();
  if (!term) {
    document.querySelectorAll('tbody tr').forEach(r => r.style.display = '');
    return;
  }
  document.querySelectorAll('tbody').forEach(tbody => {
    let sep = null, sepVisible = false;
    tbody.querySelectorAll('tr').forEach(row => {
      if (row.classList.contains('acab-sep') || row.classList.contains('width-sep')) {
        if (sep) sep.style.display = sepVisible ? '' : 'none';
        sep = row; sepVisible = false; row.style.display = '';
      } else {
        const match = row.textContent.toLowerCase().includes(term);
        row.style.display = match ? '' : 'none';
        if (match) sepVisible = true;
      }
    });
    if (sep) sep.style.display = sepVisible ? '' : 'none';
  });
}

// ── BREADCRUMB ────────────────────────────────────────
function buildBreadcrumb() {
  const SL = {
    portasLacca: 'Portas LACCA',  portasUV: 'Portas UV / Melamínico',
    portasELO:   'Portas ELO',    laccaAcab: 'LACCA — Bat. / Alizar / Rodapé',
    melamAcab:   'Melam. — Bat. / Alizar / Rodapé', batenteELO: 'Batente & Alizar ELO',
    historicoReajustes: 'Histórico de Reajustes',
    aplicarReajuste:    'Aplicar Reajuste',
    usuarios:           'Usuários',
    permissoes:         'Permissões',
    gerenciarTabelas:   'Gerenciar Tabelas',
    leroyMerlin:        'Leroy Merlin',
  };
  const TL = { batente: 'Batente', alizar9: 'Alizar 9mm', alizar15: 'Alizar 15mm', rodape: 'Rodapé', kitCorrer: 'Kit Correr' };
  const parts = [SL[currentSection] || currentSection, CHANNELS[currentChannel].label];
  const activeTab = subTabState[currentSection];
  if (activeTab && TL[activeTab]) parts.push(TL[activeTab]);
  return `<nav class="breadcrumb">${parts.map((p, i) =>
    i < parts.length - 1
      ? `<span class="bc-item">${p}</span><span class="bc-sep">›</span>`
      : `<span class="bc-item bc-current">${p}</span>`
  ).join('')}</nav>`;
}

// ── PORTAS ELO RENDER ─────────────────────────────────
function renderPortasELO() {
  const ch = CHANNELS[currentChannel];
  const m = ch.mult;
  const data = portasELOData;
  const WIDTHS = ['60 cm','70 cm','80 cm','90 cm','100 cm','110 cm'];
  const totalLinhas = data.colecoes.reduce((s, c) => s + c.grupos.reduce((gs, g) => gs + g.itens.length, 0), 0);

  let html = `
    <div class="page-header">
      <div class="page-title">Portas ELO</div>
      <div class="page-meta">
        <span class="meta-pill">${data.colecoes.length} coleções · ${totalLinhas} linhas</span>
        Preços em BRL · ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </div>
    </div>
    <div class="channel-indicator ${ch.cls}">${ch.label}${m !== 1 ? ` — ×${m.toFixed(2)}` : ''}</div>
    ${currentChannel !== 'elo' ? '<div class="elo-note">ℹ Tabela ELO/Distribuidora. Preços multiplicados pelo fator do canal selecionado.</div>' : ''}`;

  for (const col of data.colecoes) {
    const rowCount = col.grupos.reduce((s, g) => s + g.itens.length, 0);
    let rows = '';
    for (const grupo of col.grupos) {
      rows += `<tr class="acab-sep ${grupo.tipo}"><td colspan="${1 + WIDTHS.length}">${grupo.nome}</td></tr>`;
      for (const item of grupo.itens) {
        rows += `<tr><td style="min-width:190px">${item.linha}</td>${item.p.map(v =>
          v !== null ? `<td class="td-price">${fmt(v * m)}</td>` : `<td class="dash">—</td>`
        ).join('')}</tr>`;
      }
    }
    html += `
      <div class="table-card">
        <div class="table-card-header">
          <div><span class="table-card-title">${col.nome}</span><span class="colecao-sub">${col.sub}</span></div>
          <span class="table-card-count">${rowCount} linhas</span>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>Linha</th>${WIDTHS.map(w => `<th class="th-price">${w}</th>`).join('')}</tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>`;
  }

  const adicionalTable = items => `
    <div class="table-wrap"><table>
      <thead><tr><th>Item</th><th class="th-price">Preço Unit.</th></tr></thead>
      <tbody>${items.map(a => `<tr><td>${a.item}</td><td class="td-price price">${fmt(a.p * m)}</td></tr>`).join('')}</tbody>
    </table></div>`;

  html += `<div class="adicional-grid">
    <div class="adicional-card"><div class="table-card-header"><span class="table-card-title">Itens Adicionais</span><span class="table-card-count">${data.adicionais.length} itens</span></div>${adicionalTable(data.adicionais)}</div>
    <div class="adicional-card"><div class="table-card-header"><span class="table-card-title">Ferragens</span><span class="table-card-count">${data.ferragens.length} itens</span></div>${adicionalTable(data.ferragens)}</div>
  </div>`;
  return html;
}

// ── BATENTE / ALIZAR / KIT ELO RENDER ─────────────────
function renderBatenteELO() {
  const activeTab = subTabState[currentSection] || 'batente';
  const ch = CHANNELS[currentChannel];
  const m = ch.mult;
  const base = eloAcabBase;
  const scaleP = g => ({ ...g, itens: g.itens.map(it => ({ ...it, preco: it.preco * m, protect: it.protect * m })) });
  const data = {
    batente:   { ...base.batente,   grupos: base.batente.grupos.map(scaleP) },
    alizar9:   { ...base.alizar9,   grupos: base.alizar9.grupos.map(scaleP) },
    alizar15:  { ...base.alizar15,  grupos: base.alizar15.grupos.map(scaleP) },
    kitCorrer: { ...base.kitCorrer, itens: base.kitCorrer.itens.map(it => ({ ...it, preco: it.preco * m })) },
  };
  const TABS = [
    { id: 'batente',   label: 'Batente' },
    { id: 'alizar9',   label: 'Alizar 9mm' },
    { id: 'alizar15',  label: 'Alizar 15mm' },
    { id: 'kitCorrer', label: 'Kit Correr' },
  ];
  const tabBar = `<div class="inner-tabs-bar">${TABS.map(t =>
    `<button class="inner-tab${activeTab === t.id ? ' active' : ''}" onclick="switchTab('${t.id}')">${t.label}</button>`
  ).join('')}</div>`;
  let tabContent;
  switch (activeTab) {
    case 'alizar9':   tabContent = renderProtectTable(data.alizar9);     break;
    case 'alizar15':  tabContent = renderProtectTable(data.alizar15);    break;
    case 'kitCorrer': tabContent = renderKitCorrerTable(data.kitCorrer); break;
    default:          tabContent = renderProtectTable(data.batente);     break;
  }
  const multNote = m !== 1 ? ` — ×${m.toFixed(2)}` : '';
  return `
    <div class="page-header">
      <div class="page-title">Batente · Alizar · Kit ELO</div>
      <div class="page-meta">
        <span class="meta-pill">MDF Superflora · ELO</span>
        Preços em BRL · ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </div>
    </div>
    <div class="channel-indicator ${ch.cls}">${ch.label}${multNote}</div>
    ${tabBar}
    ${tabContent}`;
}

// ── LACCA ACAB: TAB SWITCH ────────────────────────────
function switchTab(tabId) {
  subTabState[currentSection] = tabId;
  render();
}

// ── ACAB SECTION: GENERIC SCALE ──────────────────────
function scaleAcabBase(base) {
  const m = CHANNELS[currentChannel].mult;
  const scaleGrupos = grupos => grupos.map(g => ({
    ...g,
    itens: g.itens.map(it => {
      if (it.precoRegua !== undefined)
        return { ...it, precoRegua: it.precoRegua * m, precoMl: it.precoMl * m };
      return { ...it, preco: it.preco * m, protect: it.protect * m };
    })
  }));
  return {
    batente:   { ...base.batente,   grupos: scaleGrupos(base.batente.grupos)   },
    alizar9:   { ...base.alizar9,   grupos: scaleGrupos(base.alizar9.grupos)   },
    alizar15:  { ...base.alizar15,  grupos: scaleGrupos(base.alizar15.grupos)  },
    rodape:    { ...base.rodape,    grupos: scaleGrupos(base.rodape.grupos)     },
    kitCorrer: { ...base.kitCorrer, itens:  base.kitCorrer.itens.map(it => ({ ...it, preco: it.preco * m })) },
  };
}

// ── LACCA ACAB: PROTECT+ TABLE ───────────────────────
function renderProtectTable(section) {
  const totalItems = section.grupos.reduce((s, g) => s + g.itens.length, 0);
  let rows = '';
  for (const grupo of section.grupos) {
    rows += `<tr class="width-sep"><td colspan="3">${grupo.label}</td></tr>`;
    for (const item of grupo.itens) {
      rows += `<tr>
        <td style="min-width:260px">${item.acab}</td>
        <td class="td-price price">${fmt(item.preco)}</td>
        <td class="protect-price">${fmt(item.protect)}</td>
      </tr>`;
    }
  }
  return `
    <div class="table-card">
      <div class="table-card-header">
        <div><span class="table-card-title">${section.title}</span><span class="colecao-sub">${section.subtitle}</span></div>
        <span class="table-card-count">${totalItems} itens</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Acabamento</th>
          <th class="th-price">Preço</th>
          <th class="th-price th-protect">C/ Protect+</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>`;
}

// ── LACCA ACAB: RODAPÉ TABLE ─────────────────────────
function renderRodapeTable(section) {
  const totalItems = section.grupos.reduce((s, g) => s + g.itens.length, 0);
  let rows = '';
  for (const grupo of section.grupos) {
    rows += `<tr class="width-sep"><td colspan="3">${grupo.label}</td></tr>`;
    for (const item of grupo.itens) {
      rows += `<tr>
        <td style="min-width:260px">${item.acab}</td>
        <td class="price-regua">${fmt(item.precoRegua)}</td>
        <td class="price-ml">${fmt(item.precoMl)}</td>
      </tr>`;
    }
  }
  return `
    <div class="table-card">
      <div class="table-card-header">
        <div><span class="table-card-title">${section.title}</span><span class="colecao-sub">${section.subtitle}</span></div>
        <span class="table-card-count">${totalItems} itens</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Acabamento</th>
          <th class="th-price">Régua (2,40 m)</th>
          <th class="th-price">Metro Linear</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>`;
}

// ── LACCA ACAB: KIT CORRER TABLE ─────────────────────
function renderKitCorrerTable(section) {
  return `
    <div class="table-card">
      <div class="table-card-header">
        <span class="table-card-title">${section.title}</span>
        <span class="table-card-count">${section.itens.length} itens</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Item</th><th class="th-price">Preço Unit.</th></tr></thead>
        <tbody>${section.itens.map(it =>
          `<tr><td>${it.item}</td><td class="td-price price">${fmt(it.preco)}</td></tr>`
        ).join('')}</tbody>
      </table></div>
    </div>`;
}

// ── ACAB SECTION: GENERIC RENDER ─────────────────────
function renderAcabSection(base, title) {
  const activeTab = subTabState[currentSection] || 'batente';
  const ch = CHANNELS[currentChannel];
  const data = scaleAcabBase(base);

  const TABS = [
    { id: 'batente',   label: 'Batente' },
    { id: 'alizar9',   label: 'Alizar 9mm' },
    { id: 'alizar15',  label: 'Alizar 15mm' },
    { id: 'rodape',    label: 'Rodapé' },
    { id: 'kitCorrer', label: 'Kit Correr' },
  ];

  const tabBar = `<div class="inner-tabs-bar">${TABS.map(t =>
    `<button class="inner-tab${activeTab === t.id ? ' active' : ''}" onclick="switchTab('${t.id}')">${t.label}</button>`
  ).join('')}</div>`;

  let tabContent = '';
  switch (activeTab) {
    case 'batente':   tabContent = renderProtectTable(data.batente);     break;
    case 'alizar9':   tabContent = renderProtectTable(data.alizar9);     break;
    case 'alizar15':  tabContent = renderProtectTable(data.alizar15);    break;
    case 'rodape':    tabContent = renderRodapeTable(data.rodape);       break;
    case 'kitCorrer': tabContent = renderKitCorrerTable(data.kitCorrer); break;
  }

  const multNote = ch.mult !== 1 ? ` — preços Fábrica ×${ch.mult.toFixed(2)}` : '';

  return `
    <div class="page-header">
      <div class="page-title">${title}</div>
      <div class="page-meta">
        <span class="meta-pill">MDF Superflora · 5 categorias</span>
        Preços em BRL · ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </div>
    </div>
    <div class="channel-indicator ${ch.cls}">${ch.label}${multNote}</div>
    ${tabBar}
    ${tabContent}`;
}

function renderLaccaAcab() {
  return renderAcabSection(laccaAcabBase, 'Batente · Alizar · Rodapé LACCA');
}

function renderMelamAcab() {
  return renderAcabSection(melamAcabBase, 'Batente · Alizar · Rodapé Melamínico');
}

// ── PORTAS LACCA RENDER ───────────────────────────────
function renderPortasLacca() {
  const chKey = portasLaccaData[currentChannel] ? currentChannel : 'distribuidora';
  return renderColecaoSection(portasLaccaData, 'Portas LACCA', chKey);
}

// ── RENDER GENÉRICO POR COLEÇÃO ──────────────────────
function renderColecaoSection(sectionData, title, chKey) {
  const ch = CHANNELS[currentChannel];
  const data = sectionData[chKey] || sectionData.distribuidora;
  const isELO = currentChannel === 'elo';

  const totalLinhas = data.colecoes.reduce((s, c) =>
    s + c.grupos.reduce((gs, g) => gs + g.itens.length, 0), 0);

  let html = `
    <div class="page-header">
      <div class="page-title">${title}</div>
      <div class="page-meta">
        <span class="meta-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4M16 3h5v5M10 14L21 3"/></svg>
          ${data.colecoes.length} coleções · ${totalLinhas} linhas
        </span>
        Preços em BRL · ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </div>
    </div>
    <div class="channel-indicator ${ch.cls}">${ch.label}</div>
    ${isELO ? '<div class="elo-note">⚠ Canal ELO não possui tabela específica para esta linha. Exibindo preços Distribuidora como referência.</div>' : ''}
  `;

  const WIDTHS = ['60 cm','70 cm','80 cm','90 cm','100 cm'];

  for (const col of data.colecoes) {
    const rowCount = col.grupos.reduce((s, g) => s + g.itens.length, 0);
    let rows = '';
    for (const grupo of col.grupos) {
      rows += `<tr class="acab-sep ${grupo.tipo}"><td colspan="6">${grupo.nome}</td></tr>`;
      for (const item of grupo.itens) {
        rows += `<tr><td style="min-width:190px">${item.linha}</td>${item.p.map(v => `<td class="td-price">${fmt(v)}</td>`).join('')}</tr>`;
      }
    }
    html += `
      <div class="table-card">
        <div class="table-card-header">
          <div><span class="table-card-title">${col.nome}</span><span class="colecao-sub">${col.sub}</span></div>
          <span class="table-card-count">${rowCount} linhas</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Linha</th>
              ${WIDTHS.map(w => `<th class="th-price">${w}</th>`).join('')}
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  const adicionalTable = items => `
    <div class="table-wrap"><table>
      <thead><tr><th>Item</th><th class="th-price">Preço Unit.</th></tr></thead>
      <tbody>${items.map(a => `<tr><td>${a.item}</td><td class="td-price price">${fmt(a.p)}</td></tr>`).join('')}</tbody>
    </table></div>`;

  html += `
    <div class="adicional-grid">
      <div class="adicional-card">
        <div class="table-card-header">
          <span class="table-card-title">Itens Adicionais</span>
          <span class="table-card-count">${data.adicionais.length} itens</span>
        </div>
        ${adicionalTable(data.adicionais)}
      </div>
      <div class="adicional-card">
        <div class="table-card-header">
          <span class="table-card-title">Ferragens</span>
          <span class="table-card-count">${data.ferragens.length} itens</span>
        </div>
        ${adicionalTable(data.ferragens)}
      </div>
    </div>`;

  return html;
}

// ── RENDER ────────────────────────────────────────────
function renderTable(section) {
  if (section === 'portasLacca')        return renderPortasLacca();
  if (section === 'portasELO')          return renderPortasELO();
  if (section === 'batenteELO')         return renderBatenteELO();
  if (section === 'laccaAcab')          return renderLaccaAcab();
  if (section === 'melamAcab')          return renderMelamAcab();
  if (section === 'historicoReajustes') return renderHistoricoReajustes();
  if (section === 'aplicarReajuste')    return renderAplicarReajuste();
  if (section === 'usuarios')           return (typeof renderUsuarios   === 'function' ? renderUsuarios()   : '<div class="empty-state"><div class="empty-icon">🔒</div><p class="empty-text">Módulo não disponível.</p></div>');
  if (section === 'permissoes')         return (typeof renderPermissoes       === 'function' ? renderPermissoes()       : '<div class="empty-state"><div class="empty-icon">🔒</div><p class="empty-text">Módulo não disponível.</p></div>');
  if (section === 'gerenciarTabelas')   return (typeof renderGerenciarTabelas === 'function' ? renderGerenciarTabelas() : '<div class="empty-state"><div class="empty-icon">🔒</div><p class="empty-text">Módulo não disponível.</p></div>');
  if (section === 'leroyMerlin')        return (typeof renderLeroyMerlin      === 'function' ? renderLeroyMerlin()      : '<div class="empty-state"><div class="empty-icon">🏪</div><p class="empty-text">Módulo não disponível.</p></div>');
  if (section === 'portasUV') {
    const chKey = portasUVData[currentChannel] ? currentChannel : 'distribuidora';
    return renderColecaoSection(portasUVData, 'Portas UV / Melamínico', chKey);
  }

  const data = DATA[section];
  if (!data) return '<div class="empty-state"><div class="empty-icon">🔍</div><p class="empty-text">Seção não encontrada.</p></div>';

  const ch = CHANNELS[currentChannel];
  const mult = ch.mult;
  const hasDims = data.hasDims;
  const count = data.rows.length;

  let totalBase = data.rows.reduce((s, r) => s + r[r.length - 1], 0);
  let totalCalc = totalBase * mult;

  // Channel indicator
  const indicator = `<div class="channel-indicator ${ch.cls}">${ch.label}${mult !== 1 ? ' — ×' + mult.toFixed(2) : ''}</div>`;

  // Page header
  const header = `
    <div class="page-header">
      <div class="page-title">${data.title}</div>
      <div class="page-meta">
        <span class="meta-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4M16 3h5v5M10 14L21 3"/></svg>
          ${count} itens
        </span>
        Preços em BRL · ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </div>
    </div>`;

  // Table columns
  const cols = data.columns;
  const thead = `<thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;

  // Table body
  const tbody = `<tbody>${data.rows.map(row => {
    const base = row[row.length - 1];
    const price = calcPrice(base);
    const code = row[0];
    const desc = row[1];

    let cells = `<td class="code">${code}</td><td>${desc}</td>`;

    if (hasDims) {
      cells += `<td class="dim">${row[2]}</td><td class="dim">${row[3]}</td><td class="dim">${row[4]}</td>`;
    }
    cells += `<td class="price">${fmt(price)}</td>`;

    return `<tr>${cells}</tr>`;
  }).join('')}</tbody>`;

  // Footer
  const tfoot = `<tfoot><tr><td colspan="${hasDims ? 5 : 2}">${count} produto${count > 1 ? 's' : ''}</td><td>${fmt(totalCalc)}</td></tr></tfoot>`;

  const table = `
    <div class="table-card">
      <div class="table-card-header">
        <span class="table-card-title">${data.title}</span>
        <span class="table-card-count">${count} referências</span>
      </div>
      <div class="table-wrap">
        <table>${thead}${tbody}${tfoot}</table>
      </div>
    </div>`;

  return `${header}${indicator}${table}`;
}

const MGMT_SECTIONS = new Set(['aplicarReajuste', 'historicoReajustes', 'usuarios', 'permissoes', 'gerenciarTabelas']);

function render() {
  const content = document.getElementById('content');
  content.innerHTML = buildBreadcrumb() + renderTable(currentSection);
  applySearch();
  if (typeof onAfterRender === 'function') onAfterRender(currentSection);

  const isMgmt  = MGMT_SECTIONS.has(currentSection);
  const isLeroy = currentSection === 'leroyMerlin';

  // Channel-tabs: oculto para gestão e para Leroy (canal exclusivo, não usa multiplicador)
  const hideChannel = el => { if (el) el.style.display = (isMgmt || isLeroy) ? 'none' : ''; };
  hideChannel(document.getElementById('channel-tabs'));
  hideChannel(document.querySelector('.channel-label'));

  // Search, print, date: visíveis para Leroy (ocultos só em gestão pura)
  const hideMgmt = el => { if (el) el.style.display = isMgmt ? 'none' : ''; };
  hideMgmt(document.querySelector('.search-wrap'));
  hideMgmt(document.querySelector('.print-btn'));
  hideMgmt(document.getElementById('date-badge'));
}

// ── NAVIGATION ────────────────────────────────────────
const NAV_KEY = 'concrem_nav';
function navSave() {
  localStorage.setItem(NAV_KEY, JSON.stringify({ section: currentSection, channel: currentChannel, tabs: subTabState }));
}
function navRestore() {
  try {
    const s = JSON.parse(localStorage.getItem(NAV_KEY));
    if (!s) return;
    if (s.channel) {
      currentChannel = s.channel;
      document.querySelectorAll('.ch-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.channel === s.channel);
      });
    }
    if (s.tabs) Object.assign(subTabState, s.tabs);
    if (s.section) {
      currentSection = s.section;
      document.querySelectorAll('.nav-item').forEach(b => {
        const match = b.dataset.section === s.section &&
          (!b.dataset.tab || b.dataset.tab === (s.tabs?.[s.section] || ''));
        b.classList.toggle('active', match);
      });
    }
  } catch {}
}

function navigate(btn) {
  const newSection = btn.dataset.section;
  const newTab     = btn.dataset.tab || null;

  // Evita re-render se a seção e a aba já estão ativas (sem troca real)
  const isSameSection = newSection === currentSection;
  const isSameTab     = !newTab || newTab === (subTabState[newSection] || '');
  if (isSameSection && isSameTab) {
    // Apenas garante visual do botão ativo sem re-renderizar
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (window.innerWidth <= 768) closeSidebar();
    return;
  }

  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentSection = newSection;
  if (newTab) subTabState[currentSection] = newTab;
  searchTerm = '';
  const si = document.getElementById('search-input');
  if (si) si.value = '';
  navSave();
  render();
  if (window.innerWidth <= 768) closeSidebar(); // fecha drawer mobile
}

function setChannel(btn) {
  document.querySelectorAll('.ch-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentChannel = btn.dataset.channel;
  navSave();
  render();
}

// ── SIDEBAR: COLLAPSE / EXPAND ───────────────────────
// Clique na logo alterna o estado (aberta ↔ fechada)
function toggleCollapse(e) {
  e.stopPropagation();
  const sidebar = document.getElementById('sidebar');
  // Desktop: toggle collapsed
  if (window.innerWidth > 768) {
    sidebar.classList.toggle('collapsed');
  } else {
    // Mobile: o header click abre/fecha o drawer
    if (sidebar.classList.contains('mobile-open')) {
      closeSidebar();
    } else {
      sidebar.classList.add('mobile-open');
      document.getElementById('overlay').classList.add('show');
    }
  }
}

// ── SIDEBAR: MOBILE DRAWER (hamburger) ───────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('mobile-open')) {
    closeSidebar();
  } else {
    sidebar.classList.add('mobile-open');
    document.getElementById('overlay').classList.add('show');
  }
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('overlay').classList.remove('show');
}

// ── TEMA ──────────────────────────────────────────────
let isDark = false;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.innerHTML = isDark
      ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
      : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  }
}

// ── PRINT ───────────────────────────────────────────
const _PRINT_SEC_NAMES = {
  portasLacca: 'Portas LACCA', portasUV: 'Portas UV / Melamínico',
  portasELO: 'Portas ELO', laccaAcab: 'Batente · Alizar · Rodapé LACCA',
  melamAcab: 'Batente · Alizar · Rodapé Melamínico', batenteELO: 'Batente · Alizar · Kit ELO',
};
const _PRINT_CH_PDF = { fabrica: 'FÁBRICA', distribuidora: 'DISTRIBUIDORA', dag: 'DISTRIBUIDORA/DAG', elo: 'ELO DISTRIBUIDORA', suframa: 'ELO SUFRAMA' };

function _printPF(v) { return v != null ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''; }

function _printReajusteNote() {
  try {
    const rjd = JSON.parse(localStorage.getItem('concrem_reajustes')) || { precosAtuais: {} };
    const cnt = Object.keys(rjd.precosAtuais).filter(k => Math.abs((rjd.precosAtuais[k]?.mult ?? 1) - 1) > 0.001).length;
    if (cnt > 0) return `<p class="prjn">* Preços com reajuste aplicado (${cnt} linha(s) com ajuste ativo)</p>`;
  } catch {}
  return '';
}

// Monta o corpo (sem cabeçalho/rodapé) de uma seção para o canal atual.
function buildPrintSectionBody(section) {
  const pF = _printPF;
  const m = CHANNELS[currentChannel].mult;

  function chk(arr, n) { const r = []; for (let i = 0; i < arr.length; i += n) r.push(arr.slice(i, i + n)); return r; }

  function buildAcabRows(sec, isRodape) {
    let html = '';
    for (const block of chk(sec.grupos, 3)) {
      const maxAcab = Math.max(...block.map(g => g.itens.length));
      html += `<table class="pa" style="page-break-inside:avoid">`;
      html += `<tr><td class="pl">LARGURA</td>`;
      block.forEach((g, ci) => {
        const bg = ci % 2 === 0 ? '#8B4513' : '#6B3A2A';
        html += `<td colspan="${maxAcab}" class="pw" style="background:${bg}">${g.label.toUpperCase()}</td>`;
      });
      html += `</tr>`;
      html += `<tr><td class="pl">ACABAMENTO</td>`;
      block.forEach(g => { for (let ai = 0; ai < maxAcab; ai++) { const it = g.itens[ai]; html += `<td class="pac">${it ? it.acab : ''}</td>`; } });
      html += `</tr>`;
      if (isRodape) {
        html += `<tr><td class="pl">RÉGUA (2,40m)</td>`;
        block.forEach(g => { for (let ai = 0; ai < maxAcab; ai++) { const it = g.itens[ai]; html += `<td class="pp">${it ? pF(it.precoRegua) : ''}</td>`; } });
        html += `</tr>`;
        html += `<tr><td class="pl">METRO LINEAR</td>`;
        block.forEach(g => { for (let ai = 0; ai < maxAcab; ai++) { const it = g.itens[ai]; html += `<td class="pp">${it ? pF(it.precoMl) : ''}</td>`; } });
        html += `</tr>`;
      } else {
        html += `<tr><td class="pl">PREÇO DE VENDA</td>`;
        block.forEach(g => { for (let ai = 0; ai < maxAcab; ai++) { const it = g.itens[ai]; html += `<td class="pp">${it ? pF(it.preco) : ''}</td>`; } });
        html += `</tr>`;
        html += `<tr><td class="pl">C/ PROTECT+</td>`;
        block.forEach(g => { for (let ai = 0; ai < maxAcab; ai++) { const it = g.itens[ai]; html += `<td class="pp">${it ? pF(it.protect) : ''}</td>`; } });
        html += `</tr>`;
      }
      html += `</table><div style="height:3px"></div>`;
    }
    return html;
  }

  function acabBlock(title, subtitle, sec, isRodape) {
    return `<div class="pblk">`
      + `<div class="psep">PRODUTO: ${title}</div>`
      + (subtitle ? `<div class="ptit">${subtitle.toUpperCase()}</div>` : '')
      + buildAcabRows(sec, isRodape)
      + `</div>`;
  }

  function kitBlock(kit) {
    let h = `<div class="psep">KIT PORTA DE CORRER</div>`;
    h += `<table class="pst"><thead><tr><th style="text-align:left;width:70%">Item</th><th>Preço</th></tr></thead><tbody>`;
    kit.itens.forEach(it => { h += `<tr><td>${it.item}</td><td class="pp">${pF(it.preco)}</td></tr>`; });
    return h + `</tbody></table>`;
  }

  function fullAcabBody(data, tipo) {
    return acabBlock(`BATENTE ${tipo}`, data.batente.subtitle, data.batente, false)
      + acabBlock(`ALIZAR ${tipo} — 9mm`, data.alizar9.subtitle, data.alizar9, false)
      + acabBlock(`ALIZAR ${tipo} — 15mm`, data.alizar15.subtitle, data.alizar15, false)
      + acabBlock(`RODAPÉ ${tipo}`, data.rodape.subtitle, data.rodape, true)
      + kitBlock(data.kitCorrer);
  }

  function buildPortasBody(data, extraCol) {
    const widths = extraCol
      ? (data.colecoes[0]?.grupos[0]?.itens[0]?.p?.length === 6 ? [60, 70, 80, 90, 100, 110] : [60, 70, 80, 90, 100])
      : [60, 70, 80, 90, 100];
    let html = '';
    for (const col of data.colecoes) {
      html += `<div class="pblk">`;
      html += `<div class="pcolhdr">${col.nome} — ${col.sub}</div>`;
      html += `<table class="ppt"><thead><tr><th style="text-align:left">LINHA</th>`;
      widths.forEach(w => { html += `<th>${w} cm</th>`; });
      html += `</tr></thead><tbody>`;
      for (const g of col.grupos) {
        html += `<tr class="ppas"><td colspan="${1 + widths.length}">${g.nome}</td></tr>`;
        for (const it of g.itens) {
          html += `<tr><td>${it.linha}</td>`;
          for (let wi = 0; wi < widths.length; wi++) { const v = it.p[wi]; html += `<td class="pp">${v != null ? pF(v) : '—'}</td>`; }
          html += `</tr>`;
        }
      }
      html += `</tbody></table></div>`;
    }
    if (data.adicionais?.length) {
      html += `<div class="pblk"><div class="ptit" style="margin-top:8px">ITENS ADICIONAIS</div>`;
      html += `<table class="pst"><thead><tr><th style="text-align:left">Item</th><th>Preço</th></tr></thead><tbody>`;
      data.adicionais.forEach(a => { html += `<tr><td>${a.item}</td><td class="pp">${pF(a.p)}</td></tr>`; });
      html += `</tbody></table></div>`;
    }
    if (data.ferragens?.length) {
      html += `<div class="pblk"><div class="ptit" style="margin-top:4px">FERRAGENS</div>`;
      html += `<table class="pst"><thead><tr><th style="text-align:left">Item</th><th>Preço</th></tr></thead><tbody>`;
      data.ferragens.forEach(a => { html += `<tr><td>${a.item}</td><td class="pp">${pF(a.p)}</td></tr>`; });
      html += `</tbody></table></div>`;
    }
    return html;
  }

  switch (section) {
    case 'laccaAcab': return fullAcabBody(scaleAcabBase(laccaAcabBase), 'LACCA');
    case 'melamAcab': return fullAcabBody(scaleAcabBase(melamAcabBase), 'MELAMÍNICO');
    case 'batenteELO': {
      const sc = g => ({ ...g, itens: g.itens.map(it => ({ ...it, preco: it.preco * m, protect: it.protect * m })) });
      const d = {
        batente:  { ...eloAcabBase.batente,  grupos: eloAcabBase.batente.grupos.map(sc) },
        alizar9:  { ...eloAcabBase.alizar9,  grupos: eloAcabBase.alizar9.grupos.map(sc) },
        alizar15: { ...eloAcabBase.alizar15, grupos: eloAcabBase.alizar15.grupos.map(sc) },
        kitCorrer:{ ...eloAcabBase.kitCorrer, itens: eloAcabBase.kitCorrer.itens.map(it => ({ ...it, preco: it.preco * m })) },
      };
      return acabBlock('BATENTE ELO', d.batente.subtitle, d.batente, false)
        + acabBlock('ALIZAR ELO — 9mm', d.alizar9.subtitle, d.alizar9, false)
        + acabBlock('ALIZAR ELO — 15mm', d.alizar15.subtitle, d.alizar15, false)
        + kitBlock(d.kitCorrer);
    }
    case 'portasLacca': {
      const k = portasLaccaData[currentChannel] ? currentChannel : 'distribuidora';
      return buildPortasBody(portasLaccaData[k], false);
    }
    case 'portasUV': {
      const k = portasUVData[currentChannel] ? currentChannel : 'distribuidora';
      return buildPortasBody(portasUVData[k], false);
    }
    case 'portasELO': {
      const sd = {
        ...portasELOData,
        colecoes: portasELOData.colecoes.map(col => ({
          ...col, grupos: col.grupos.map(g => ({
            ...g, itens: g.itens.map(it => ({ ...it, p: it.p.map(v => v !== null ? +(v * m).toFixed(2) : null) }))
          }))
        })),
        adicionais: portasELOData.adicionais.map(a => ({ ...a, p: +(a.p * m).toFixed(2) })),
        ferragens:  portasELOData.ferragens.map(a => ({ ...a, p: +(a.p * m).toFixed(2) })),
      };
      return buildPortasBody(sd, true);
    }
  }
  return '';
}

function _printStyles() {
  return `
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:Arial,sans-serif; font-size:9px; color:#1a1a1a; background:#fff; }
@page { size:A4 portrait; margin:8mm 10mm; }
table { border-collapse:collapse; }
.phdr { width:100%; margin-bottom:7px; }
.phdr td { padding:0 6px 5px; border-bottom:2.5px solid #1a5c2a; vertical-align:middle; }
.phdr-logo { width:90px; } .phdr-logo img { height:30px; }
.phdr-title { text-align:center; font-size:13px; font-weight:bold; text-transform:uppercase; }
.phdr-chan { text-align:right; font-size:11px; font-weight:bold; color:#1a5c2a; text-transform:uppercase; white-space:nowrap; }
.psep { background:#1a252f; color:#fff; font-size:9.5px; font-weight:bold; text-align:center;
        padding:3px 8px; margin:7px 0 3px; page-break-after:avoid; break-after:avoid;
        -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.ptit { background:#e0e0e0; color:#222; font-size:8px; font-weight:bold; text-align:center;
        padding:2px 8px; margin:2px 0 3px; page-break-after:avoid; break-after:avoid;
        -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.pcolhdr { background:#1a5c2a; color:#fff; font-size:9.5px; font-weight:bold; text-align:center;
           padding:3px 8px; margin:6px 0 2px; page-break-after:avoid; break-after:avoid;
           -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.pa { border-collapse:collapse; width:100%; margin-bottom:2px; page-break-inside:avoid; }
.pa td { border:0.5px solid #bbb; padding:2px 4px; line-height:1.3; vertical-align:middle; }
.pw { color:#fff; font-weight:bold; text-align:center; font-size:8.5px;
      -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.pl { font-weight:bold; font-size:8px; color:#333; background:#f0f0f0; white-space:nowrap; min-width:88px;
      -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.pac { font-size:7.5px; text-align:center; color:#444; background:#fafafa;
       -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.pp { text-align:right; font-weight:bold; color:#c00000; font-size:8.5px; white-space:nowrap;
      -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.ppt { border-collapse:collapse; width:100%; margin-bottom:3px; }
.ppt th { background:#2c3e50; color:#fff; padding:2px 5px; text-align:center; font-size:8px; border:0.5px solid #444;
          -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.ppt td { border:0.5px solid #ccc; padding:2px 4px; font-size:8px; }
.ppas { page-break-after:avoid; break-after:avoid; }
.ppas td { background:#e8f5e9; color:#1a5c2a; font-weight:bold; font-size:8px; padding:2px 5px;
           -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.pst { border-collapse:collapse; width:auto; min-width:280px; margin-bottom:4px; }
.pst th { background:#2c3e50; color:#fff; padding:2px 8px; font-size:8px; border:0.5px solid #444;
          -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.pst td { border:0.5px solid #ccc; padding:2px 6px; font-size:8px; }
.pgbreak { page-break-before:always; break-before:page; }
.pblk { margin-bottom:6px; }
.pftr { margin-top:8px; border-top:1px solid #ccc; padding-top:4px; text-align:center; }
.pftr img { height:18px; opacity:.5; }
.pftr-date { font-size:7px; color:#888; margin-top:2px; }
.prjn { font-size:7.5px; color:#555; font-style:italic; text-align:left; margin-bottom:3px; }`;
}

function _printHeader(secTitle, chLabel, LOGO) {
  return `<table class="phdr" width="100%"><tr>
  <td class="phdr-logo"><img src="${LOGO}" alt="CONCREM"></td>
  <td class="phdr-title">PRODUTO: ${secTitle.toUpperCase()}</td>
  <td class="phdr-chan">${chLabel}</td>
</tr></table>`;
}

function _printFooter(LOGO, dateStr, rjNote) {
  return `<div class="pftr">
  ${rjNote}
  <img src="${LOGO}" alt="CONCREM">
  <div class="pftr-date">${dateStr}</div>
</div>`;
}

function _printOpenDoc(title, inner) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>${title}</title>
<style>${_printStyles()}</style></head>
<body>${inner}</body></html>`;
  const win = window.open('', '_blank', 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no');
  if (!win) { alert('Popup bloqueado. Permita popups para este site e tente novamente.'); return; }
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}

function printSection() {
  if (currentSection === 'leroyMerlin') { lmImprimirTodos(); return; }
  const ch = CHANNELS[currentChannel];
  const LOGO = new URL('Logos/logo-cores.png', window.location.href).href;
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const chLabel = _PRINT_CH_PDF[currentChannel] || ch.label.toUpperCase();
  const secTitle = _PRINT_SEC_NAMES[currentSection] || currentSection;
  const body = buildPrintSectionBody(currentSection);
  if (!body) { alert('Esta seção não tem tabela para imprimir.'); return; }
  const inner = _printHeader(secTitle, chLabel, LOGO) + body + _printFooter(LOGO, dateStr, _printReajusteNote());
  _printOpenDoc(`${secTitle} — ${chLabel}`, inner);
}

// Imprime TODAS as tabelas do canal atual em um único PDF.
function printAll() {
  if (currentSection === 'leroyMerlin') { lmImprimirTodos(); return; }
  const ch = CHANNELS[currentChannel];
  const LOGO = new URL('Logos/logo-cores.png', window.location.href).href;
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const chLabel = _PRINT_CH_PDF[currentChannel] || ch.label.toUpperCase();
  const isEloChannel = currentChannel === 'elo' || currentChannel === 'suframa';
  const sections = isEloChannel
    ? ['portasELO', 'batenteELO']
    : ['portasLacca', 'portasUV', 'laccaAcab', 'melamAcab'];

  let inner = '';
  let first = true;
  for (const sec of sections) {
    const body = buildPrintSectionBody(sec);
    if (!body) continue;
    const secTitle = _PRINT_SEC_NAMES[sec] || sec;
    inner += (first ? '' : '<div class="pgbreak"></div>') + _printHeader(secTitle, chLabel, LOGO) + body;
    first = false;
  }
  if (!inner) { alert('Nada para imprimir neste canal.'); return; }
  inner += _printFooter(LOGO, dateStr, _printReajusteNote());
  _printOpenDoc(`Tabela completa — ${chLabel}`, inner);
}


// ── DATE ────────────────────────────────────────────
(function setDate() {
  const d = new Date();
  const label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  document.getElementById('date-badge').textContent = label;
})();

// ── INIT ────────────────────────────────────────────
// Chamado por auth.js após sessão confirmada
function initApp() {
  navRestore();
  render();
}
