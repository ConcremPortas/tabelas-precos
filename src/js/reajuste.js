// ── SISTEMA DE REAJUSTE DE PREÇOS (por linha) ─────────────────────────────────

// 1. Snapshot dos originais (imutável)
const _RJ_ORIG = (function() {
  const c = o => JSON.parse(JSON.stringify(o));
  return {
    portasLacca: { fabrica: c(portasLaccaData.fabrica), distribuidora: c(portasLaccaData.distribuidora) },
    portasUV:    { fabrica: c(portasUVData.fabrica),    distribuidora: c(portasUVData.distribuidora) },
    portasELO: c(portasELOData),
    laccaAcab: c(laccaAcabBase),
    melamAcab: c(melamAcabBase),
    eloAcab:   c(eloAcabBase),
  };
})();

// 2. Cache em memória (populado por rjInitFromSupabase após login)
const RJ_KEY = 'concrem_reajustes';
let _rjCache = { historico: [], precosAtuais: {} };

function rjLoad() { return _rjCache; }
function rjSave(d) {
  _rjCache = d;
  // Em modo demo mantém cópia no localStorage como fallback offline
  if (typeof DEMO_MODE === 'undefined' || DEMO_MODE) {
    try { localStorage.setItem(RJ_KEY, JSON.stringify(d)); } catch { /* quota exceeded */ }
  }
}

// Multiplicador combinado: global (___all) × linha específica
function rjGetM(produto, canal, linha) {
  const pa = rjLoad().precosAtuais;
  const base  = `${produto}_${canal}`;
  const allM  = pa[`${base}___all`]?.mult ?? 1;
  const lineM = linha != null ? (pa[`${base}___${linha}`]?.mult ?? 1) : 1;
  return allM * lineM;
}

// 3. Extrair linhas únicas por produto+canal (para popular o select)
function rjGetLinhas(produto, canal) {
  const o = _RJ_ORIG;
  const set = new Set();
  function fromPortas(data) {
    data.colecoes.forEach(col => col.grupos.forEach(g => g.itens.forEach(it => set.add(it.linha))));
  }
  function fromBatAliz(data) {
    ['batente','alizar9','alizar15'].forEach(p => data[p]?.grupos?.forEach(g => g.itens.forEach(it => set.add(it.acab))));
    data.kitCorrer?.itens?.forEach(it => set.add(it.item));
  }
  function fromRodape(data) {
    data.rodape?.grupos?.forEach(g => g.itens.forEach(it => set.add(it.acab)));
  }
  const distBase = canal === 'distribuidora' || canal === 'dag';
  switch(produto) {
    case 'Portas LACCA':                fromPortas(distBase ? o.portasLacca.distribuidora : o.portasLacca.fabrica); break;
    case 'Portas UV Melamínico':        fromPortas(distBase ? o.portasUV.distribuidora    : o.portasUV.fabrica);    break;
    case 'Portas ELO':                  fromPortas(o.portasELO); break;
    case 'Batente & Alizar LACCA':      fromBatAliz(o.laccaAcab); break;
    case 'Batente & Alizar Melamínico': fromBatAliz(o.melamAcab); break;
    case 'Batente & Alizar ELO':        o.eloAcab.batente?.grupos?.forEach(g => g.itens.forEach(it => set.add(it.acab))); break;
    case 'Rodapé LACCA':                fromRodape(o.laccaAcab); break;
    case 'Rodapé Melamínico':           fromRodape(o.melamAcab); break;
  }
  return ['___all', ...[...set]];
}

// 4. Aplicar reajustes em memória (chamado antes de cada render)
function rjApplyToMemory() {
  const ch = currentChannel;

  function applyPortas(orig, prod, canalKey) {
    return {
      ...orig,
      colecoes: orig.colecoes.map(col => ({
        ...col,
        grupos: col.grupos.map(g => ({
          ...g,
          itens: g.itens.map(it => {
            const f = rjGetM(prod, canalKey, it.linha);
            return { ...it, p: it.p.map(v => v !== null ? +(v * f).toFixed(2) : null) };
          })
        }))
      })),
      adicionais: orig.adicionais.map(a => ({ ...a, p: +(a.p * rjGetM(prod, canalKey, null)).toFixed(2) })),
      ferragens:  orig.ferragens.map(a  => ({ ...a, p: +(a.p * rjGetM(prod, canalKey, null)).toFixed(2) })),
    };
  }

  function applyAcab(orig, batAlizProd, rodapeProd, canalKey) {
    const sg = (grupos, prod) => grupos.map(g => ({
      ...g,
      itens: g.itens.map(it => {
        const f = rjGetM(prod, canalKey, it.acab);
        if (it.precoRegua !== undefined)
          return { ...it, precoRegua: +(it.precoRegua * f).toFixed(2), precoMl: +(it.precoMl * f).toFixed(2) };
        return { ...it, preco: +(it.preco * f).toFixed(2), protect: +(it.protect * f).toFixed(2) };
      })
    }));
    return {
      batente:   { ...orig.batente,   grupos: sg(orig.batente.grupos,   batAlizProd) },
      alizar9:   { ...orig.alizar9,   grupos: sg(orig.alizar9.grupos,   batAlizProd) },
      alizar15:  { ...orig.alizar15,  grupos: sg(orig.alizar15.grupos,  batAlizProd) },
      rodape:    { ...orig.rodape,    grupos: sg(orig.rodape.grupos,    rodapeProd)  },
      kitCorrer: { ...orig.kitCorrer, itens: orig.kitCorrer.itens.map(it => ({
        ...it, preco: +(it.preco * rjGetM(batAlizProd, canalKey, it.item)).toFixed(2)
      })) },
    };
  }

  portasLaccaData.fabrica       = applyPortas(_RJ_ORIG.portasLacca.fabrica,       'Portas LACCA', 'fabrica');
  portasLaccaData.distribuidora = applyPortas(_RJ_ORIG.portasLacca.distribuidora, 'Portas LACCA', 'distribuidora');
  portasLaccaData.dag           = applyPortas(_RJ_ORIG.portasLacca.distribuidora, 'Portas LACCA', 'dag');
  portasUVData.fabrica          = applyPortas(_RJ_ORIG.portasUV.fabrica,          'Portas UV Melamínico', 'fabrica');
  portasUVData.distribuidora    = applyPortas(_RJ_ORIG.portasUV.distribuidora,    'Portas UV Melamínico', 'distribuidora');
  portasUVData.dag              = applyPortas(_RJ_ORIG.portasUV.distribuidora,    'Portas UV Melamínico', 'dag');
  Object.assign(portasELOData, applyPortas(_RJ_ORIG.portasELO, 'Portas ELO', ch));
  Object.assign(laccaAcabBase, applyAcab(_RJ_ORIG.laccaAcab, 'Batente & Alizar LACCA',      'Rodapé LACCA',      ch));
  Object.assign(melamAcabBase, applyAcab(_RJ_ORIG.melamAcab, 'Batente & Alizar Melamínico', 'Rodapé Melamínico', ch));
  Object.assign(eloAcabBase, {
    batente: {
      ..._RJ_ORIG.eloAcab.batente,
      grupos: _RJ_ORIG.eloAcab.batente.grupos.map(g => ({
        ...g,
        itens: g.itens.map(it => {
          const f = rjGetM('Batente & Alizar ELO', ch, it.acab);
          return { ...it, preco: +(it.preco * f).toFixed(2), protect: +(it.protect * f).toFixed(2) };
        })
      }))
    }
  });
}

// 5. Preço representativo da linha selecionada (usa dados já aplicados em memória)
function rjSamplePrice(produto, canal, linha) {
  const mC = CHANNELS[canal]?.mult ?? 1;
  function portasSample(data) {
    for (const col of data.colecoes)
      for (const g of col.grupos)
        for (const it of g.itens)
          if (linha === '___all' || it.linha === linha) {
            const v = it.p.find(x => x !== null);
            if (v != null) return v;
          }
    return 0;
  }
  function acabSample(data, isRodape) {
    const secs = isRodape ? [data.rodape] : [data.batente, data.alizar9, data.alizar15];
    for (const sec of secs)
      for (const g of (sec?.grupos ?? []))
        for (const it of g.itens)
          if (linha === '___all' || it.acab === linha)
            return isRodape ? (it.precoRegua ?? 0) : (it.preco ?? 0);
    if (!isRodape)
      for (const it of (data.kitCorrer?.itens ?? []))
        if (linha === '___all' || it.item === linha) return it.preco ?? 0;
    return 0;
  }
  switch(produto) {
    case 'Portas LACCA':                return portasSample(canal === 'fabrica' ? portasLaccaData.fabrica : portasLaccaData.distribuidora);
    case 'Portas UV Melamínico':        return portasSample(canal === 'fabrica' ? portasUVData.fabrica    : portasUVData.distribuidora);
    case 'Portas ELO':                  return +(portasSample(portasELOData) * mC).toFixed(2);
    case 'Batente & Alizar LACCA':      return +(acabSample(laccaAcabBase, false) * mC).toFixed(2);
    case 'Batente & Alizar Melamínico': return +(acabSample(melamAcabBase, false) * mC).toFixed(2);
    case 'Rodapé LACCA':                return +(acabSample(laccaAcabBase, true)  * mC).toFixed(2);
    case 'Rodapé Melamínico':           return +(acabSample(melamAcabBase, true)  * mC).toFixed(2);
    case 'Batente & Alizar ELO': {
      for (const g of (eloAcabBase.batente?.grupos ?? []))
        for (const it of g.itens)
          if (linha === '___all' || it.acab === linha) return +(it.preco * mC).toFixed(2);
      return 0;
    }
    default: return 0;
  }
}

// ── SUPABASE: helpers de persistência ────────────────────────────────────────

async function _rjSbInsertReajuste(entry) {
  if (!_sb) return;
  try {
    await _sb.from('concremtp_reajustes').insert({
      id:              entry.id,
      produto:         entry.produto,
      canal:           entry.canal,
      linha:           entry.linha,
      porcentagem:     entry.porcentagem,
      motivo:          entry.motivo || null,
      data_hora:       entry.dataHora,
      precos_antes:    entry.precosAntes   || null,
      sample_antes:    entry.sampleAntes  != null ? entry.sampleAntes : null,
      linhas_snapshot: entry.linhasSnapshot || null,
      criado_por:      (typeof currentUser !== 'undefined' && currentUser?.id) || null,
    });
  } catch { /* fire-and-forget */ }
}

async function _rjSbUpsertPreco(chave, mult) {
  if (!_sb) return;
  try {
    await _sb.from('concremtp_precos_atuais').upsert({
      chave,
      mult,
      atualizado_em:  new Date().toISOString(),
      atualizado_por: (typeof currentUser !== 'undefined' && currentUser?.id) || null,
    });
  } catch { /* fire-and-forget */ }
}

async function _rjSbDeleteReajuste(id) {
  if (!_sb) return;
  try { await _sb.from('concremtp_reajustes').delete().eq('id', id); } catch { /* fire-and-forget */ }
}

async function _rjSbDeletePreco(chave) {
  if (!_sb) return;
  try { await _sb.from('concremtp_precos_atuais').delete().eq('chave', chave); } catch { /* fire-and-forget */ }
}

// Migra formato antigo de chaves (sem '___' → ___all; bug '______all' → ___all)
function _rjRunMigrations() {
  const d = _rjCache;
  let migrated = false;
  const newPA = {};
  Object.keys(d.precosAtuais).forEach(k => {
    if (!k.includes('___')) {
      newPA[k + '___all'] = d.precosAtuais[k]; migrated = true;
    } else if (k.endsWith('______all')) {
      newPA[k.replace(/______all$/, '___all')] = d.precosAtuais[k]; migrated = true;
    } else {
      newPA[k] = d.precosAtuais[k];
    }
  });
  d.historico.forEach(e => { if (!e.linha) { e.linha = '___all'; migrated = true; } });
  if (migrated) { d.precosAtuais = newPA; _rjCache = d; }
}

// Copia dados do localStorage para o Supabase e limpa o localStorage
async function _rjMigrateFromLocalStorage() {
  try {
    const stored = JSON.parse(localStorage.getItem(RJ_KEY));
    if (!stored) return;
    const hist   = stored.historico    || [];
    const precos = stored.precosAtuais || {};
    if (!hist.length && !Object.keys(precos).length) return;
    for (const e of hist)                           await _rjSbInsertReajuste(e);
    for (const [chave, val] of Object.entries(precos)) await _rjSbUpsertPreco(chave, val.mult);
    _rjCache = stored;
    localStorage.removeItem(RJ_KEY);
  } catch { /* migração silenciosa */ }
}

// Inicializa cache: carrega do Supabase (ou localStorage em demo) ao fazer login
async function rjInitFromSupabase() {
  const isDemo = (typeof DEMO_MODE === 'undefined') || DEMO_MODE;

  if (isDemo) {
    try {
      _rjCache = JSON.parse(localStorage.getItem(RJ_KEY)) || { historico: [], precosAtuais: {} };
    } catch {
      _rjCache = { historico: [], precosAtuais: {} };
    }
    _rjRunMigrations();
    return;
  }

  try {
    const [histRes, precosRes] = await Promise.race([
      Promise.all([
        _sb.from('concremtp_reajustes').select('*').order('data_hora', { ascending: true }),
        _sb.from('concremtp_precos_atuais').select('*'),
      ]),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000)),
    ]);

    const historico = (histRes.data || []).map(row => ({
      id:             row.id,
      produto:        row.produto,
      canal:          row.canal,
      linha:          row.linha,
      porcentagem:    parseFloat(row.porcentagem),
      motivo:         row.motivo,
      dataHora:       row.data_hora,
      precosAntes:    row.precos_antes,
      sampleAntes:    row.sample_antes != null ? parseFloat(row.sample_antes) : null,
      linhasSnapshot: row.linhas_snapshot,
    }));

    const precosAtuais = {};
    (precosRes.data || []).forEach(row => {
      precosAtuais[row.chave] = { mult: parseFloat(row.mult) };
    });

    _rjCache = { historico, precosAtuais };

    // Se Supabase está vazio e localStorage tem dados → migrar automaticamente
    if (!historico.length && !Object.keys(precosAtuais).length) {
      await _rjMigrateFromLocalStorage();
    }

    _rjRunMigrations();
  } catch {
    // Fallback: usa localStorage em caso de erro de rede/timeout
    try {
      _rjCache = JSON.parse(localStorage.getItem(RJ_KEY)) || { historico: [], precosAtuais: {} };
      _rjRunMigrations();
    } catch {
      _rjCache = { historico: [], precosAtuais: {} };
    }
  }
}

// 6. Interceptar render
const _rjOrigRender = render;
render = function() {
  rjApplyToMemory();
  _rjOrigRender();
  rjUpdateBadge();
};

// 7. Badge
function rjUpdateBadge() {
  document.querySelectorAll('.rj-badge').forEach(b => b.remove());
  const info = rjCurrentBadgeInfo();
  if (!info) return;
  const title = document.querySelector('.page-title');
  if (!title) return;
  const badge = document.createElement('span');
  let txt = '';
  if (info.allPct !== 0 && info.lineCount > 0)
    txt = `${info.allPct > 0 ? '+' : ''}${info.allPct.toFixed(1).replace('.',',')}% global · ${info.lineCount} linha(s)`;
  else if (info.allPct !== 0)
    txt = `${info.allPct > 0 ? '+' : ''}${info.allPct.toFixed(1).replace('.',',')}% global`;
  else
    txt = `${info.lineCount} linha(s) reajustada(s)`;
  badge.className = 'rj-badge ' + (info.allPct >= 0 ? 'rj-badge-pos' : 'rj-badge-neg');
  badge.textContent = txt;
  title.appendChild(badge);
}

function rjCurrentBadgeInfo() {
  const ch = currentChannel;
  let produto = null;
  switch(currentSection) {
    case 'portasLacca': produto = 'Portas LACCA'; break;
    case 'portasUV':    produto = 'Portas UV Melamínico'; break;
    case 'portasELO':   produto = 'Portas ELO'; break;
    case 'batenteELO':  produto = 'Batente & Alizar ELO'; break;
    case 'laccaAcab': { const tab = subTabState['laccaAcab'] || 'batente'; produto = tab === 'rodape' ? 'Rodapé LACCA' : 'Batente & Alizar LACCA'; break; }
    case 'melamAcab': { const tab = subTabState['melamAcab'] || 'batente'; produto = tab === 'rodape' ? 'Rodapé Melamínico' : 'Batente & Alizar Melamínico'; break; }
  }
  if (!produto) return null;
  const pa = rjLoad().precosAtuais;
  const base = `${produto}_${ch}`;
  const allMult   = pa[`${base}___all`]?.mult ?? 1;
  const lineCount = Object.keys(pa).filter(k => k.startsWith(base + '___') && k !== `${base}___all` && Math.abs((pa[k]?.mult ?? 1) - 1) > 0.001).length;
  if (Math.abs(allMult - 1) < 0.001 && lineCount === 0) return null;
  return { produto, canal: ch, allPct: (allMult - 1) * 100, lineCount };
}

// 8. Página Aplicar Reajuste
function renderAplicarReajuste() {
  return `
  <div class="page-header">
    <div class="page-title">Aplicar Reajuste</div>
    <div class="page-meta">
      <span class="meta-pill">Ajuste percentual acumulativo por linha de produto</span>
    </div>
  </div>

  <div class="rj-page-layout">

    <!-- Coluna: Formulário -->
    <div class="rj-page-card">
      <div class="rj-form-grid">
        <div class="rj-field">
          <label class="rj-label" for="rj-produto">Produto</label>
          <select class="rj-select" id="rj-produto" onchange="rjOnProdutoOrCanal()">
            <option value="">Selecione o produto...</option>
            <option value="Portas LACCA">Portas LACCA</option>
            <option value="Portas UV Melamínico">Portas UV Melamínico</option>
            <option value="Batente &amp; Alizar LACCA">Batente &amp; Alizar LACCA</option>
            <option value="Batente &amp; Alizar Melamínico">Batente &amp; Alizar Melamínico</option>
            <option value="Rodapé LACCA">Rodapé LACCA</option>
            <option value="Rodapé Melamínico">Rodapé Melamínico</option>
            <option value="Portas ELO">Portas ELO</option>
            <option value="Batente &amp; Alizar ELO">Batente &amp; Alizar ELO</option>
          </select>
        </div>

        <div class="rj-field">
          <label class="rj-label" for="rj-canal">Canal</label>
          <select class="rj-select" id="rj-canal" onchange="rjOnProdutoOrCanal()">
            <option value="">Selecione o canal...</option>
            <option value="fabrica">Fábrica</option>
            <option value="distribuidora">Distribuidora</option>
            <option value="dag">DAG</option>
            <option value="elo">ELO</option>
          </select>
        </div>

        <div class="rj-field rj-full">
          <label class="rj-label" for="rj-linha">Linha de Produto</label>
          <select class="rj-select" id="rj-linha" disabled onchange="rjOnFormChange()">
            <option value="">Selecione produto e canal primeiro...</option>
          </select>
        </div>

        <div class="rj-field rj-full">
          <label class="rj-label" for="rj-pct">Porcentagem (%)</label>
          <input class="rj-input" type="number" id="rj-pct" step="0.01"
            placeholder="Ex: 10 para +10% ou -5 para -5%" oninput="rjOnFormChange()">
          <span class="rj-hint">Positivo = acréscimo · Negativo = desconto</span>
        </div>

        <div class="rj-field rj-full">
          <label class="rj-label" for="rj-motivo">Motivo</label>
          <textarea class="rj-textarea" id="rj-motivo"
            placeholder="Descreva o motivo do reajuste..." oninput="rjOnFormChange()"></textarea>
        </div>
      </div>

      <button class="rj-apply-btn" id="rj-apply-btn" disabled onclick="rjApply()">
        Aplicar Reajuste
      </button>
    </div>

    <!-- Coluna: Prévia ao vivo -->
    <div class="rj-live-panel" id="rj-live-panel">
      <div class="rj-live-empty" id="rj-live-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="36" height="36" style="color:#d1d5db"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        <p>Preencha o formulário para ver<br>a prévia dos preços alterados.</p>
      </div>
      <div id="rj-live-content" style="display:none">
        <div class="rj-live-hdr" id="rj-live-hdr"></div>
        <div class="rj-live-rows" id="rj-live-rows"></div>
      </div>
    </div>

  </div>

  <!-- Campos ocultos para compatibilidade de lógica existente -->
  <div style="display:none">
    <div id="rj-base-info"><span id="rj-base-lbl"></span><strong id="rj-base-val"></strong><strong id="rj-after-val"></strong></div>
    <div id="rj-preview"><div id="rj-preview-text"></div></div>
  </div>`;
}

// 9. Formulário
const RJ_CANAL_LABELS = { fabrica: 'Fábrica', distribuidora: 'Distribuidora', dag: 'DAG', elo: 'ELO' };

function rjResetForm() {
  ['rj-produto','rj-canal','rj-pct','rj-motivo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const linhaEl = document.getElementById('rj-linha');
  linhaEl.innerHTML = '<option value="">Selecione produto e canal primeiro...</option>';
  linhaEl.disabled = true;
  document.getElementById('rj-preview').style.display = 'none';
  document.getElementById('rj-base-info').style.display = 'none';
  document.getElementById('rj-apply-btn').disabled = true;
}

function rjOnProdutoOrCanal() {
  const produto = document.getElementById('rj-produto').value;
  const canal   = document.getElementById('rj-canal').value;
  const linhaEl = document.getElementById('rj-linha');
  linhaEl.innerHTML = '';
  linhaEl.disabled = true;
  if (produto && canal) {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione a linha...';
    linhaEl.appendChild(placeholder);
    rjGetLinhas(produto, canal).forEach(l => {
      const opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l === '___all' ? '— Todas as linhas —' : l;
      linhaEl.appendChild(opt);
    });
    linhaEl.disabled = false;
  } else {
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Selecione produto e canal primeiro...';
    linhaEl.appendChild(ph);
  }
  rjOnFormChange();
}

function rjOnFormChange() {
  const produto  = document.getElementById('rj-produto').value;
  const canal    = document.getElementById('rj-canal').value;
  const linha    = document.getElementById('rj-linha').value;
  const pctRaw   = document.getElementById('rj-pct').value;
  const motivo   = document.getElementById('rj-motivo').value.trim();
  const pct      = parseFloat(pctRaw);
  const preview  = document.getElementById('rj-preview');
  const baseInfo = document.getElementById('rj-base-info');

  if (produto && canal && linha && pctRaw !== '' && !isNaN(pct)) {
    const sign       = pct >= 0 ? '+' : '';
    const linhaLabel = linha === '___all' ? 'todas as linhas' : `"${linha}"`;
    document.getElementById('rj-preview-text').textContent =
      `Aplicar ${sign}${pct.toFixed(2).replace('.', ',')}% em ${produto} — ${RJ_CANAL_LABELS[canal] || canal} — ${linhaLabel}`;
    preview.style.display = '';
    const sample = rjSamplePrice(produto, canal, linha);
    if (sample > 0) {
      const afterPrice = sample * (1 + pct / 100);
      const isAll = linha === '___all';
      const lineCount = isAll ? rjGetLinhas(produto, canal).length - 1 : null; // -1 to exclude ___all itself
      const baseLbl = document.getElementById('rj-base-lbl');
      if (baseLbl) baseLbl.textContent = isAll
        ? `Referência — 1.ª linha (${lineCount} linhas serão ajustadas):`
        : 'Preço base atual (1.ª linha):';
      document.getElementById('rj-base-val').textContent  = fmt(sample);
      document.getElementById('rj-after-val').textContent = fmt(afterPrice);
      const afterEl = document.getElementById('rj-after-val');
      afterEl.style.color = pct >= 0 ? '#16a34a' : '#dc2626';
      baseInfo.style.display = '';
    } else {
      baseInfo.style.display = 'none';
    }
    _rjUpdateLivePanel(produto, canal, linha, pct);
  } else {
    preview.style.display = 'none';
    baseInfo.style.display = 'none';
    _rjUpdateLivePanel(null);
  }

  document.getElementById('rj-apply-btn').disabled =
    !(produto && canal && linha && pctRaw !== '' && !isNaN(pct) && motivo.length > 0);
}

// 10. Painel de prévia ao vivo (coluna direita)
function _rjUpdateLivePanel(produto, canal, linha, pct) {
  const empty   = document.getElementById('rj-live-empty');
  const content = document.getElementById('rj-live-content');
  if (!empty || !content) return;

  if (!produto) {
    empty.style.display = ''; content.style.display = 'none'; return;
  }
  empty.style.display = 'none'; content.style.display = '';

  const sign    = pct >= 0 ? '+' : '';
  const isAll   = linha === '___all';
  const canal_l = RJ_CANAL_LABELS[canal] || canal;
  const linhaL  = isAll ? 'Todas as linhas' : linha;
  const color   = pct >= 0 ? '#16a34a' : '#dc2626';
  const bgColor = pct >= 0 ? '#f0fdf4' : '#fef2f2';
  const bdColor = pct >= 0 ? '#bbf7d0' : '#fecaca';

  // Header do painel
  document.getElementById('rj-live-hdr').innerHTML = `
    <div class="rj-lh-top">
      <div class="rj-lh-badge" style="background:${bgColor};border-color:${bdColor};color:${color}">
        ${sign}${pct.toFixed(2).replace('.', ',')}%
      </div>
      <div class="rj-lh-info">
        <div class="rj-lh-prod">${produto}</div>
        <div class="rj-lh-meta">${canal_l} · ${linhaL}</div>
      </div>
    </div>
    <div class="rj-lh-desc">Os preços abaixo mostram o impacto do reajuste proposto.</div>`;

  // Linhas de prévia
  const rows = document.getElementById('rj-live-rows');
  if (isAll) {
    const all = _rjCaptureAllLinhas(produto, canal, pct);
    if (!all.length) { rows.innerHTML = ''; return; }
    const byGrupo = {};
    all.forEach(r => { if (!byGrupo[r.grupo]) byGrupo[r.grupo] = []; byGrupo[r.grupo].push(r); });
    let html = '';
    for (const [grp, items] of Object.entries(byGrupo)) {
      html += `<div class="rj-lv-grp">${grp}</div>`;
      items.forEach(r => {
        html += `<div class="rj-lv-row">
          <span class="rj-lv-name">${r.linha}</span>
          <span class="rj-lv-antes">${fmt(r.antes)}</span>
          <span class="rj-lv-arrow">→</span>
          <span class="rj-lv-depois" style="color:${color}">${fmt(r.depois)}</span>
        </div>`;
      });
    }
    rows.innerHTML = html;
  } else {
    const antes  = rjSamplePrice(produto, canal, linha);
    const depois = +(antes * (1 + pct / 100)).toFixed(2);
    rows.innerHTML = antes > 0 ? `
      <div class="rj-lv-single">
        <div class="rj-lv-single-lbl">${linha}</div>
        <div class="rj-lv-single-prices">
          <div class="rj-lv-single-blk">
            <div class="rj-lv-single-title">Antes</div>
            <div class="rj-lv-single-val">${fmt(antes)}</div>
          </div>
          <div class="rj-lv-single-sep" style="color:${color}">→</div>
          <div class="rj-lv-single-blk">
            <div class="rj-lv-single-title">Depois</div>
            <div class="rj-lv-single-val" style="color:${color};font-size:20px">${fmt(depois)}</div>
          </div>
        </div>
        <div class="rj-lv-single-diff" style="color:${color}">
          ${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct).toFixed(2).replace('.', ',')}% · ${pct >= 0 ? '+' : ''}${fmt(+(depois - antes).toFixed(2))} por unidade
        </div>
      </div>` : '';
  }
}

// 11. Captura snapshot completo de todas as linhas (antes do reajuste)
function _rjCaptureAllLinhas(produto, canal, pct) {
  const mult   = 1 + pct / 100;
  const result = [];
  const distBase = canal === 'distribuidora' || canal === 'dag';

  function fromPortas(data) {
    data.colecoes.forEach(col => {
      col.grupos.forEach(g => {
        g.itens.forEach(it => {
          const v = it.p.find(x => x !== null);
          if (v != null) result.push({
            grupo: `${col.nome} — ${g.nome}`,
            linha: it.linha,
            antes: v,
            depois: +(v * mult).toFixed(2),
          });
        });
      });
    });
  }

  function fromAcab(base, isRodape) {
    const secs = isRodape
      ? [{ nome: 'Rodapé', data: base.rodape }]
      : [
          { nome: 'Batente', data: base.batente },
          { nome: 'Alizar 9mm', data: base.alizar9 },
          { nome: 'Alizar 15mm', data: base.alizar15 },
        ];
    secs.forEach(({ nome, data }) => {
      data?.grupos?.forEach(g => {
        g.itens.forEach(it => {
          const v = isRodape ? (it.precoRegua ?? 0) : (it.preco ?? 0);
          if (v > 0) result.push({
            grupo: `${nome} — ${g.nome}`,
            linha: it.acab,
            antes: v,
            depois: +(v * mult).toFixed(2),
          });
        });
      });
    });
  }

  switch (produto) {
    case 'Portas LACCA':
      fromPortas(distBase ? portasLaccaData.distribuidora : portasLaccaData.fabrica); break;
    case 'Portas UV Melamínico':
      fromPortas(distBase ? portasUVData.distribuidora : portasUVData.fabrica); break;
    case 'Portas ELO':
      fromPortas(portasELOData); break;
    case 'Batente & Alizar LACCA':
      fromAcab(laccaAcabBase, false); break;
    case 'Batente & Alizar Melamínico':
      fromAcab(melamAcabBase, false); break;
    case 'Batente & Alizar ELO':
      eloAcabBase.batente?.grupos?.forEach(g => g.itens.forEach(it => {
        if (it.preco > 0) result.push({ grupo: `Batente — ${g.nome}`, linha: it.acab, antes: it.preco, depois: +(it.preco * mult).toFixed(2) });
      }));
      break;
    case 'Rodapé LACCA':
      fromAcab(laccaAcabBase, true); break;
    case 'Rodapé Melamínico':
      fromAcab(melamAcabBase, true); break;
  }
  return result;
}

// 11. Aplicar reajuste
function rjApply() {
  const produto = document.getElementById('rj-produto').value;
  const canal   = document.getElementById('rj-canal').value;
  const linha   = document.getElementById('rj-linha').value;
  const pct     = parseFloat(document.getElementById('rj-pct').value);
  const motivo  = document.getElementById('rj-motivo').value.trim();
  if (!produto || !canal || !linha || isNaN(pct) || motivo.length === 0) return;

  const d        = rjLoad();
  const key      = `${produto}_${canal}___${linha === '___all' ? 'all' : linha}`;
  const prevMult = d.precosAtuais[key]?.mult ?? 1;
  const newMult  = prevMult * (1 + pct / 100);
  const sample   = rjSamplePrice(produto, canal, linha);

  // Se for "Todas as linhas", captura todas as linhas com seu grupo/coleção
  let linhasSnapshot = null;
  if (linha === '___all') {
    linhasSnapshot = _rjCaptureAllLinhas(produto, canal, pct);
  }

  d.historico.push({
    id: Date.now().toString(),
    produto, canal, linha,
    porcentagem: pct, motivo,
    dataHora:    new Date().toISOString(),
    precosAntes: { mult: prevMult },
    sampleAntes: sample,
    ...(linhasSnapshot ? { linhasSnapshot } : {}),
  });
  d.precosAtuais[key] = { mult: newMult };
  rjSave(d);
  // Persiste no Supabase de forma assíncrona (fire-and-forget)
  if (typeof DEMO_MODE !== 'undefined' && !DEMO_MODE) {
    const newEntry = d.historico[d.historico.length - 1];
    _rjSbInsertReajuste(newEntry);
    _rjSbUpsertPreco(key, newMult);
  }
  rjApplyToMemory();
  rjUpdateBadge();

  const btn = document.getElementById('rj-apply-btn');
  if (btn) {
    btn.textContent = '✓ Reajuste aplicado!';
    btn.style.background = '#15803d';
    btn.disabled = true;
    setTimeout(() => {
      // Reset form fields in-place (sem re-render da página)
      ['rj-produto','rj-canal','rj-pct','rj-motivo'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      const linhaEl = document.getElementById('rj-linha');
      if (linhaEl) { linhaEl.innerHTML = '<option value="">Selecione produto e canal primeiro...</option>'; linhaEl.disabled = true; }
      const preview = document.getElementById('rj-preview'); if (preview) preview.style.display = 'none';
      const baseInfo = document.getElementById('rj-base-info'); if (baseInfo) baseInfo.style.display = 'none';
      btn.textContent = 'Aplicar Reajuste';
      btn.style.background = '';
      btn.disabled = true;
    }, 2000);
  }
}

// 11. Histórico
function rjRenderHistorico() {
  const d    = rjLoad();
  const hist = [...d.historico].reverse();
  const el   = document.getElementById('rj-hist-content');

  if (!hist.length) {
    el.innerHTML = '<div class="rj-hist-empty">Nenhum reajuste registrado ainda.</div>';
    return;
  }

  const latestId = {};
  d.historico.forEach(e => { latestId[`${e.produto}_${e.canal}___${e.linha}`] = e.id; });

  const rows = hist.map(e => {
    const dt        = new Date(e.dataHora);
    const dStr      = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const pct       = e.porcentagem;
    const sign      = pct >= 0 ? '+' : '';
    const cls       = pct >= 0 ? 'rj-pct-pos' : 'rj-pct-neg';
    const pStr      = `${sign}${pct.toFixed(2).replace('.', ',')}%`;
    const sampleStr = e.sampleAntes ? fmt(e.sampleAntes) : '—';
    const linhaLbl  = !e.linha || e.linha === '___all'
      ? '<em style="color:#9ca3af">Todas</em>' : e.linha;
    const isLatest  = latestId[`${e.produto}_${e.canal}___${e.linha}`] === e.id;
    const undoCell  = isLatest ? `<button class="rj-undo-btn" onclick="rjUndo('${e.id}')">Desfazer</button>` : '';
    const motivoEsc = (e.motivo || '').replace(/"/g, '&quot;');
    const linhaEsc  = (e.linha  || '').replace(/"/g, '&quot;');
    return `<tr>
      <td class="rj-hist-date">${dStr}</td>
      <td>${e.produto}</td>
      <td>${RJ_CANAL_LABELS[e.canal] || e.canal}</td>
      <td style="font-size:11.5px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${linhaEsc}">${linhaLbl}</td>
      <td class="${cls}">${pStr}</td>
      <td style="text-align:right;font-family:monospace;white-space:nowrap">${sampleStr}</td>
      <td class="rj-hist-motivo" title="${motivoEsc}">${e.motivo || ''}</td>
      <td>${undoCell}</td>
    </tr>`;
  }).join('');

  el.innerHTML = `
    <div style="overflow-x:auto">
      <table class="rj-hist-tbl">
        <thead><tr>
          <th>Data/Hora</th><th>Produto</th><th>Canal</th><th>Linha</th>
          <th>Porcentagem</th><th style="text-align:right">Base Antes</th>
          <th>Motivo</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// 12. Desfazer
function rjUndo(id) {
  if (!confirm('Desfazer este reajuste irá recalcular os preços revertendo esta operação. Confirmar?')) return;
  const d   = rjLoad();
  const idx = d.historico.findIndex(e => e.id === id);
  if (idx === -1) return;
  const e        = d.historico[idx];
  const key      = `${e.produto}_${e.canal}___${e.linha === '___all' ? 'all' : e.linha}`;
  const prevMult = e.precosAntes?.mult ?? 1;
  if (Math.abs(prevMult - 1) < 0.000001) delete d.precosAtuais[key];
  else d.precosAtuais[key] = { mult: prevMult };
  d.historico.splice(idx, 1);
  rjSave(d);
  // Persiste no Supabase de forma assíncrona (fire-and-forget)
  if (typeof DEMO_MODE !== 'undefined' && !DEMO_MODE) {
    _rjSbDeleteReajuste(id);
    if (Math.abs(prevMult - 1) < 0.000001) {
      _rjSbDeletePreco(key);
    } else {
      _rjSbUpsertPreco(key, prevMult);
    }
  }
  render();
  rjRenderHistorico();
}

// 13. Exportar CSV
function rjExportCSV() {
  const d = rjLoad();
  if (!d.historico.length) { alert('Nenhum reajuste para exportar.'); return; }
  const header = ['Data/Hora','Produto','Canal','Linha','Porcentagem (%)','Base Antes','Motivo'];
  const rows = [...d.historico].reverse().map(e => [
    new Date(e.dataHora).toLocaleString('pt-BR'),
    `"${e.produto}"`,
    RJ_CANAL_LABELS[e.canal] || e.canal,
    `"${e.linha === '___all' ? 'Todas as linhas' : (e.linha || '')}"`,
    e.porcentagem.toFixed(2).replace('.', ','),
    e.sampleAntes ? e.sampleAntes.toFixed(2).replace('.', ',') : '',
    `"${(e.motivo || '').replace(/"/g, '""')}"`,
  ].join(';'));
  const csv  = [header.join(';'), ...rows].join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `reajustes_concrem_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── HISTÓRICO DE REAJUSTES — tela completa ──────────────────────────────────

let _hrYear  = new Date().getFullYear();
let _hrMonth = new Date().getMonth(); // 0-based
let _hrProd  = '';
let _hrCanal = '';
let _hrTipo  = ''; // 'positivo' | 'negativo' | ''

function hrPrevMonth() {
  _hrMonth--;
  if (_hrMonth < 0) { _hrMonth = 11; _hrYear--; }
  _hrRefresh();
}
function hrNextMonth() {
  _hrMonth++;
  if (_hrMonth > 11) { _hrMonth = 0; _hrYear++; }
  _hrRefresh();
}
function hrSetFilter(field, val) {
  if (field === 'prod')  _hrProd  = val;
  if (field === 'canal') _hrCanal = val;
  if (field === 'tipo')  _hrTipo  = val;
  _hrRefresh();
}
function hrClearFilters() {
  _hrProd = ''; _hrCanal = ''; _hrTipo = '';
  const p = document.getElementById('hr-f-prod');  if (p) p.value = '';
  const c = document.getElementById('hr-f-canal'); if (c) c.value = '';
  const t = document.getElementById('hr-f-tipo');  if (t) t.value = '';
  _hrRefresh();
}

function _hrRefresh() {
  const el = document.getElementById('hr-body');
  if (!el) return;
  el.innerHTML = _hrBuildBody();

  const now = new Date();
  const isCurrentMonth = _hrYear === now.getFullYear() && _hrMonth === now.getMonth();
  const monthName = new Date(_hrYear, _hrMonth, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const lbl = document.getElementById('hr-month-label');
  if (lbl) lbl.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const nextBtn = document.getElementById('hr-next-btn');
  if (nextBtn) nextBtn.disabled = isCurrentMonth;
}

function _hrFilteredEntries() {
  const d = rjLoad();
  return d.historico.filter(e => {
    const dt = new Date(e.dataHora);
    if (dt.getFullYear() !== _hrYear || dt.getMonth() !== _hrMonth) return false;
    if (_hrProd  && e.produto !== _hrProd)  return false;
    if (_hrCanal && e.canal   !== _hrCanal) return false;
    if (_hrTipo === 'positivo' && e.porcentagem <= 0) return false;
    if (_hrTipo === 'negativo' && e.porcentagem >= 0) return false;
    return true;
  }).reverse(); // most recent first
}

function _hrCards(entries) {
  const total    = entries.length;
  const acresci  = entries.filter(e => e.porcentagem > 0).length;
  const desconto = entries.filter(e => e.porcentagem < 0).length;
  const avgPct   = total ? (entries.reduce((s, e) => s + e.porcentagem, 0) / total) : 0;
  const fmtPct = v => (v > 0 ? '+' : '') + v.toFixed(2).replace('.', ',') + '%';

  return `
  <div class="hr-cards">
    <div class="hr-card">
      <div class="hr-card-icon hr-card-icon-blue">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      </div>
      <div class="hr-card-body">
        <div class="hr-card-val">${total}</div>
        <div class="hr-card-lbl">Total de Reajustes</div>
      </div>
    </div>
    <div class="hr-card">
      <div class="hr-card-icon hr-card-icon-green">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>
      </div>
      <div class="hr-card-body">
        <div class="hr-card-val hr-green">${acresci}</div>
        <div class="hr-card-lbl">Acréscimos</div>
      </div>
    </div>
    <div class="hr-card">
      <div class="hr-card-icon hr-card-icon-red">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="hr-card-body">
        <div class="hr-card-val hr-red">${desconto}</div>
        <div class="hr-card-lbl">Descontos</div>
      </div>
    </div>
    <div class="hr-card">
      <div class="hr-card-icon hr-card-icon-purple">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
      </div>
      <div class="hr-card-body">
        <div class="hr-card-val ${avgPct >= 0 ? 'hr-green' : 'hr-red'}">${total ? fmtPct(avgPct) : '—'}</div>
        <div class="hr-card-lbl">Média do Período</div>
      </div>
    </div>
  </div>`;
}

function hrToggleDetail(id) {
  const el = document.getElementById('hr-detail-' + id);
  const btn = document.getElementById('hr-detbtn-' + id);
  if (!el) return;
  const opening = !el.classList.contains('hr-detail-open');
  el.classList.toggle('hr-detail-open', opening);
  if (btn) btn.textContent = opening ? 'Ocultar ▲' : 'Ver detalhes ▼';
}

function _hrTable(entries) {
  if (!entries.length) {
    return `<div class="hr-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="40" height="40" style="color:#d1d5db"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p>Nenhum reajuste encontrado para este período.</p>
    </div>`;
  }
  const fmtPct = v => `<span class="${v > 0 ? 'hr-pct-pos' : 'hr-pct-neg'}">${v > 0 ? '+' : ''}${v.toFixed(2).replace('.', ',')}%</span>`;
  const fmtCur = v => v != null ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';

  const rows = entries.flatMap(e => {
    const dt  = new Date(e.dataHora);
    const dtF = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const isAll = e.linha === '___all';
    const linhaLabel = isAll ? '<em style="color:#6b7280">Todas as linhas</em>' : (e.linha || '—');
    const canal = RJ_CANAL_LABELS[e.canal] || e.canal;
    const hasSnapshot = Array.isArray(e.linhasSnapshot) && e.linhasSnapshot.length > 0;

    const mainRow = `<tr>
      <td class="hr-td-date">${dtF}</td>
      <td>${e.produto}</td>
      <td>${canal}</td>
      <td>${linhaLabel}</td>
      <td class="hr-td-pct">${fmtPct(e.porcentagem)}</td>
      <td class="hr-td-base">${fmtCur(e.sampleAntes)}</td>
      <td class="hr-td-motivo" title="${(e.motivo||'').replace(/"/g,'&quot;')}">${e.motivo || '—'}</td>
      <td style="white-space:nowrap;display:flex;gap:6px;align-items:center">
        ${hasSnapshot ? `<button id="hr-detbtn-${e.id}" class="hr-detail-btn" onclick="hrToggleDetail('${e.id}')">Ver detalhes ▼</button>` : ''}
        <button class="hr-undo-btn" onclick="rjUndo('${e.id}')">Desfazer</button>
      </td>
    </tr>`;

    if (!hasSnapshot) return [mainRow];

    // Agrupar por "grupo" (coleção — acabamento)
    const byGrupo = {};
    e.linhasSnapshot.forEach(row => {
      if (!byGrupo[row.grupo]) byGrupo[row.grupo] = [];
      byGrupo[row.grupo].push(row);
    });

    const detailRows = Object.entries(byGrupo).map(([grpName, rows]) => {
      const grpHeader = `<tr class="hr-detail-grp"><td colspan="4" style="padding:6px 10px 3px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;background:#f9fafb">${grpName}</td></tr>`;
      const grpRows = rows.map(r => `<tr class="hr-detail-sub">
        <td style="padding-left:32px;font-size:12px;color:#374151;width:40%">${r.linha}</td>
        <td class="hr-td-base" style="font-size:12px;width:25%">${fmtCur(r.antes)}</td>
        <td style="color:#9ca3af;font-size:12px;width:10%;text-align:center">→</td>
        <td class="hr-td-base" style="font-size:12px;width:25%;color:${e.porcentagem >= 0 ? '#16a34a' : '#dc2626'}">${fmtCur(r.depois)}</td>
      </tr>`).join('');
      return grpHeader + grpRows;
    }).join('');

    const detailWrapper = `<tr id="hr-detail-${e.id}" class="hr-detail-row">
      <td colspan="8" style="padding:0;border-top:2px solid #e5e7eb">
        <table class="hr-detail-tbl" style="width:100%">
          <thead><tr>
            <th style="padding:6px 10px 4px 32px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase">Linha</th>
            <th style="padding:6px 10px 4px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase">Antes</th>
            <th></th>
            <th style="padding:6px 10px 4px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase">Depois</th>
          </tr></thead>
          <tbody>${detailRows}</tbody>
        </table>
      </td>
    </tr>`;

    return [mainRow, detailWrapper];
  }).join('');

  return `<div class="hr-tbl-wrap">
    <table class="hr-tbl">
      <thead><tr>
        <th>Data / Hora</th><th>Produto</th><th>Canal</th><th>Linha</th>
        <th>%</th><th>Base Antes</th><th>Motivo</th><th></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function _hrTimeline(entries) {
  if (!entries.length) return '';
  const byDay = {};
  entries.forEach(e => {
    const day = new Date(e.dataHora).toLocaleDateString('pt-BR');
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(e);
  });
  const fmtPct = v => (v > 0 ? '+' : '') + v.toFixed(2).replace('.', ',') + '%';
  let html = '<div class="hr-timeline">';
  for (const [day, evs] of Object.entries(byDay)) {
    html += `<div class="hr-tl-day-label">${day}</div>`;
    evs.forEach(e => {
      const canal = RJ_CANAL_LABELS[e.canal] || e.canal;
      const linha = e.linha === '___all' ? 'Todas as linhas' : e.linha;
      const pct = e.porcentagem;
      html += `<div class="hr-tl-item">
        <div class="hr-tl-dot ${pct >= 0 ? 'hr-tl-dot-green' : 'hr-tl-dot-red'}"></div>
        <div class="hr-tl-content">
          <div class="hr-tl-title">${e.produto} · ${canal}</div>
          <div class="hr-tl-sub">${linha} — <span class="${pct >= 0 ? 'hr-green' : 'hr-red'}">${fmtPct(pct)}</span></div>
          ${e.motivo ? `<div class="hr-tl-motivo">${e.motivo}</div>` : ''}
        </div>
        <div class="hr-tl-time">${new Date(e.dataHora).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'})}</div>
      </div>`;
    });
  }
  html += '</div>';
  return html;
}

function hrExportCSV() {
  const entries = _hrFilteredEntries();
  if (!entries.length) { alert('Nenhum reajuste para exportar neste período.'); return; }
  const monthName = new Date(_hrYear, _hrMonth, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const header = ['Data/Hora', 'Produto', 'Canal', 'Linha', 'Porcentagem (%)', 'Base Antes', 'Motivo'];
  const rows = entries.map(e => [
    new Date(e.dataHora).toLocaleString('pt-BR'),
    `"${e.produto}"`,
    RJ_CANAL_LABELS[e.canal] || e.canal,
    `"${e.linha === '___all' ? 'Todas as linhas' : (e.linha || '')}"`,
    e.porcentagem.toFixed(2).replace('.', ','),
    e.sampleAntes ? e.sampleAntes.toFixed(2).replace('.', ',') : '',
    `"${(e.motivo || '').replace(/"/g, '""')}"`,
  ].join(';'));
  const csv  = [header.join(';'), ...rows].join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `reajustes_${_hrMonth + 1}_${_hrYear}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function hrPrintPDF() {
  const entries = _hrFilteredEntries();
  const monthName = new Date(_hrYear, _hrMonth, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const logoUrl = new URL('Logos/logo-cores.png', window.location.href).href;
  const fmtPct = v => (v > 0 ? '+' : '') + v.toFixed(2).replace('.', ',') + '%';
  const fmtCur = v => v != null ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';

  let rows = '';
  if (!entries.length) {
    rows = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#6b7280">Nenhum reajuste encontrado.</td></tr>';
  } else {
    rows = entries.map(e => {
      const dt = new Date(e.dataHora);
      const dtF = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const canal = RJ_CANAL_LABELS[e.canal] || e.canal;
      const linha = e.linha === '___all' ? 'Todas as linhas' : (e.linha || '—');
      const pct = e.porcentagem;
      return `<tr>
        <td>${dtF}</td>
        <td>${e.produto}</td>
        <td>${canal}</td>
        <td>${linha}</td>
        <td style="color:${pct >= 0 ? '#15803d' : '#c00000'};font-weight:700">${fmtPct(pct)}</td>
        <td>${fmtCur(e.sampleAntes)}</td>
      </tr>`;
    }).join('');
  }

  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head>
  <meta charset="UTF-8">
  <title>Histórico de Reajustes — ${monthName}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; background: #fff; }
    .phdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
    .phdr img { height: 36px; }
    .phdr-info { text-align: right; }
    .phdr-title { font-size: 15px; font-weight: 700; }
    .phdr-sub { font-size: 10px; color: #6b7280; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #f3f4f6; padding: 6px 8px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: .05em; border-bottom: 1px solid #e5e7eb; }
    td { padding: 6px 8px; border-bottom: 1px solid #f3f4f6; font-size: 10px; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
  </style>
  </head><body>
  <div class="phdr">
    <img src="${logoUrl}" alt="CONCREM">
    <div class="phdr-info">
      <div class="phdr-title">Histórico de Reajustes</div>
      <div class="phdr-sub">${monthName} · Gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
    </div>
  </div>
  <table>
    <thead><tr><th>Data/Hora</th><th>Produto</th><th>Canal</th><th>Linha</th><th>%</th><th>Base Antes</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  </body></html>`);
  w.document.close();
  w.onload = () => { w.focus(); w.print(); };
}

function _hrBuildBody() {
  const entries = _hrFilteredEntries();
  return `
    ${_hrCards(entries)}
    <div class="hr-section-title">Detalhamento</div>
    ${_hrTable(entries)}
    ${entries.length ? '<div class="hr-section-title" style="margin-top:24px">Linha do Tempo</div>' : ''}
    ${_hrTimeline(entries)}
  `;
}

function renderHistoricoReajustes() {
  const d = rjLoad();
  const allProds  = [...new Set(d.historico.map(e => e.produto))].sort();
  const allCanais = [...new Set(d.historico.map(e => e.canal))].sort();
  const now = new Date();
  const monthName = new Date(_hrYear, _hrMonth, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const isCurrentMonth = _hrYear === now.getFullYear() && _hrMonth === now.getMonth();

  const prodOpts  = ['<option value="">Todos os produtos</option>', ...allProds.map(p => `<option value="${p}" ${_hrProd === p ? 'selected' : ''}>${p}</option>`)].join('');
  const canalOpts = ['<option value="">Todos os canais</option>', ...allCanais.map(c => `<option value="${c}" ${_hrCanal === c ? 'selected' : ''}>${RJ_CANAL_LABELS[c] || c}</option>`)].join('');

  return `
  <div class="page-header">
    <div class="page-title">Histórico de Reajustes</div>
    <div class="page-meta">
      <span class="meta-pill">Registro de todas as alterações de preço</span>
    </div>
  </div>

  <div class="hr-toolbar">
    <div class="hr-month-nav">
      <button class="hr-nav-btn" onclick="hrPrevMonth()">&#8592;</button>
      <span class="hr-month-label" id="hr-month-label">${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>
      <button class="hr-nav-btn" id="hr-next-btn" onclick="hrNextMonth()" ${isCurrentMonth ? 'disabled' : ''}>&#8594;</button>
    </div>
    <div class="hr-filters">
      <select class="hr-select" id="hr-f-prod"  onchange="hrSetFilter('prod', this.value)">${prodOpts}</select>
      <select class="hr-select" id="hr-f-canal" onchange="hrSetFilter('canal', this.value)">${canalOpts}</select>
      <select class="hr-select" id="hr-f-tipo"  onchange="hrSetFilter('tipo', this.value)">
        <option value="">Tipo: todos</option>
        <option value="positivo" ${_hrTipo === 'positivo' ? 'selected' : ''}>Acréscimos</option>
        <option value="negativo" ${_hrTipo === 'negativo' ? 'selected' : ''}>Descontos</option>
      </select>
      <button class="hr-clear-btn" onclick="hrClearFilters()">Limpar</button>
    </div>
    <div class="hr-actions">
      <button class="hr-export-btn" onclick="hrExportCSV()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        CSV
      </button>
      <button class="hr-export-btn" onclick="hrPrintPDF()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        PDF
      </button>
    </div>
  </div>

  <div id="hr-body">${_hrBuildBody()}</div>
  `;
}

// 14. Init: cache começa vazio; rjInitFromSupabase() popula ao fazer login
(function rjInit() {
  rjUpdateBadge();
})();
