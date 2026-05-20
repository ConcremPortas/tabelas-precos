// ── GERENCIAR TABELAS ─────────────────────────────────────────────────────────

// ── STATE ─────────────────────────────────────────────────────────────────────
let _gtGrupos      = [];
let _gtLinhas      = [];
let _gtActiveTab   = 'grupos';
let _gtPreSelected = null; // { produto, canal } — vindo do botão de atalho
let _gtEditGrupo   = null; // grupo em edição
let _gtEditLinha   = null; // linha em edição

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const GT_PRODUTOS = [
  { value: 'portasLacca', label: 'Portas LACCA' },
  { value: 'portasUV',    label: 'Portas UV Melamínico' },
  { value: 'laccaAcab',   label: 'Batente & Alizar LACCA' },
  { value: 'melamAcab',   label: 'Batente & Alizar Melamínico' },
  { value: 'portasELO',   label: 'Portas ELO' },
  { value: 'batenteELO',  label: 'Batente & Alizar ELO' },
];

const GT_CANAIS = [
  { value: 'fabrica',       label: 'Fábrica' },
  { value: 'distribuidora', label: 'Distribuidora' },
  { value: 'dag',           label: 'DAG' },
  { value: 'elo',           label: 'ELO' },
];

const GT_TIPO_LABELS = {
  porta: 'Porta', batente: 'Batente/Alizar',
  rodape: 'Rodapé', adicional: 'Adicional', ferragem: 'Ferragem',
};
const GT_TIPO_COLORS = {
  porta: '#2563eb', batente: '#7c3aed',
  rodape: '#db2777', adicional: '#ea580c', ferragem: '#475569',
};

// Grupos hardcoded por produto
const GT_HARDCODED = {
  portasLacca: ['ESSENZIALE','INNOVAZIONE','SOFISTICATO'],
  portasUV:    ['ESSENZIALE','INNOVAZIONE','SOFISTICATO'],
  portasELO:   ['ESSENZIALE','INNOVAZIONE'],
  laccaAcab:   [],
  melamAcab:   [],
  batenteELO:  [],
};

function _gtEsc(s) {
  return String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _gtProdLabel(v) { return (GT_PRODUTOS.find(p => p.value === v) || {}).label || v; }
function _gtCanalLabel(v) { return (GT_CANAIS.find(c => c.value === v) || {}).label || v; }
function _gtFmt(n) { return (+(n||0)).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

// ── RENDER PRINCIPAL ──────────────────────────────────────────────────────────
function renderGerenciarTabelas() {
  if (!temPermissao('adicionar_itens_tabela')) {
    return `<div class="empty-state">
      <div class="empty-icon">🔒</div>
      <p class="empty-text">Acesso restrito a administradores.</p>
    </div>`;
  }

  const prodOpts = GT_PRODUTOS.map(p =>
    `<option value="${p.value}">${_gtEsc(p.label)}</option>`).join('');
  const canalOpts = GT_CANAIS.map(c =>
    `<option value="${c.value}">${_gtEsc(c.label)}</option>`).join('');

  return `
<div class="page-header">
  <div>
    <div class="page-title">Gerenciar Tabelas</div>
    <div class="page-meta">
      <span class="meta-pill">Crie e organize grupos e linhas das tabelas de preços</span>
    </div>
  </div>
</div>

<div class="gt-two-col">

  <!-- ── PAINEL ESQUERDO ─────────────────────────────────────── -->
  <div class="gt-left">

    <!-- NOVO GRUPO -->
    <div class="gt-card" id="gt-card-grupo">
      <div class="gt-card-hdr">
        <i class="ti ti-stack-2"></i>
        <span>Novo Grupo</span>
      </div>
      <div class="gt-form">

        <div class="gt-field-row">
          <div class="gt-field">
            <label class="gt-label">PRODUTO</label>
            <select id="gt-g-produto" class="gt-input" onchange="gtGrupoOnChange()">
              <option value="">Selecione…</option>${prodOpts}
            </select>
          </div>
          <div class="gt-field">
            <label class="gt-label">CANAL</label>
            <select id="gt-g-canal" class="gt-input" onchange="gtGrupoOnChange()">
              <option value="">Selecione…</option>${canalOpts}
            </select>
          </div>
        </div>

        <div class="gt-field">
          <label class="gt-label">NOME DO GRUPO</label>
          <input id="gt-g-nome" class="gt-input"
            placeholder="Ex: SOFISTICATO, PREMIUM, ESPECIAL"
            oninput="this.value=this.value.toUpperCase();gtGrupoOnChange()">
        </div>

        <div class="gt-field">
          <label class="gt-label">DESCRIÇÃO (opcional)</label>
          <input id="gt-g-desc" class="gt-input"
            placeholder="Ex: HDF Superflora 3mm · 40mm espessura"
            oninput="gtGrupoOnChange()">
        </div>

        <div class="gt-field">
          <label class="gt-label">COR DO CABEÇALHO</label>
          <div class="gt-color-row">
            <input type="color" id="gt-g-cor" class="gt-color-pick" value="#1a3a1a"
              oninput="gtGrupoCorChange(this.value)">
            <div class="gt-col-hdr-preview" id="gt-g-cor-preview"
              style="background:#1a3a1a">
              <span id="gt-g-cor-nome" style="color:#fff;font-size:12px;font-weight:700">NOVO GRUPO</span>
            </div>
          </div>
        </div>

        <p id="gt-g-erro" class="gt-erro"></p>
        <button class="gt-btn-primary" onclick="gtCriarGrupo()">Criar Grupo</button>
      </div>
    </div>

    <!-- NOVA LINHA -->
    <div class="gt-card" id="gt-card-linha">
      <div class="gt-card-hdr">
        <i class="ti ti-circle-plus"></i>
        <span>Nova Linha</span>
      </div>
      <div class="gt-form">

        <div class="gt-field-row">
          <div class="gt-field">
            <label class="gt-label">PRODUTO</label>
            <select id="gt-l-produto" class="gt-input" onchange="gtLinhaOnChange()">
              <option value="">Selecione…</option>${prodOpts}
            </select>
          </div>
          <div class="gt-field">
            <label class="gt-label">CANAL</label>
            <select id="gt-l-canal" class="gt-input" onchange="gtLinhaOnChange()">
              <option value="">Selecione…</option>${canalOpts}
            </select>
          </div>
        </div>

        <div class="gt-field">
          <label class="gt-label">GRUPO / COLEÇÃO</label>
          <select id="gt-l-grupo" class="gt-input" onchange="gtUpdatePreview()">
            <option value="">Selecione produto e canal primeiro…</option>
          </select>
        </div>

        <div class="gt-field">
          <label class="gt-label">TIPO DA LINHA</label>
          <select id="gt-l-tipo" class="gt-input" onchange="gtTipoOnChange()">
            <option value="">Selecione…</option>
            <option value="porta">Porta</option>
            <option value="batente">Batente / Alizar</option>
            <option value="rodape">Rodapé</option>
            <option value="adicional">Adicional</option>
            <option value="ferragem">Ferragem</option>
          </select>
        </div>

        <div id="gt-l-dinamico"></div>

        <p id="gt-l-erro" class="gt-erro"></p>
        <button class="gt-btn-primary" onclick="gtAdicionarLinha()">Adicionar Linha</button>
      </div>
    </div>

  </div><!-- /gt-left -->

  <!-- ── PAINEL DIREITO: PREVIEW ─────────────────────────────── -->
  <div class="gt-right">
    <div class="gt-preview-card">
      <div class="gt-preview-hdr">
        <span class="gt-preview-title"><i class="ti ti-eye"></i> Preview</span>
        <span id="gt-preview-badge" class="meta-pill" style="display:none"></span>
      </div>
      <div id="gt-preview-body" class="gt-preview-body">
        <div class="gt-preview-empty">
          <i class="ti ti-table" style="font-size:36px;opacity:.25"></i>
          <p>Selecione um produto e canal para ver o preview</p>
        </div>
      </div>
    </div>
  </div>

</div><!-- /gt-two-col -->

<!-- ── LISTA INFERIOR ─────────────────────────────────────────── -->
<div class="gt-list-section">
  <div class="gt-list-tabs-bar">
    <button class="gt-list-tab active" id="gt-tab-grupos" onclick="gtSwitchTab('grupos')">
      <i class="ti ti-stack-2"></i> Grupos criados
    </button>
    <button class="gt-list-tab" id="gt-tab-linhas" onclick="gtSwitchTab('linhas')">
      <i class="ti ti-layout-rows"></i> Linhas criadas
    </button>
  </div>
  <div id="gt-list-content" class="gt-list-body">
    <div class="gt-loading">Carregando…</div>
  </div>
</div>

<!-- Modal de edição -->
<div id="gt-edit-modal" class="gm-modal-overlay" style="display:none">
  <div class="gm-modal" style="max-width:520px">
    <div class="gm-modal-header">
      <span class="gm-modal-title" id="gt-modal-title">Editar</span>
      <button class="gm-modal-close" onclick="gtFecharModal()">✕</button>
    </div>
    <div class="gm-modal-body" id="gt-modal-body"></div>
    <div class="gm-modal-footer">
      <button class="gm-modal-btn-cancel" onclick="gtFecharModal()">Cancelar</button>
      <button class="gm-modal-btn-confirm" onclick="gtSalvarEdicao()">Salvar alterações</button>
    </div>
  </div>
</div>
`;
}

// ── INIT (chamado pelo onAfterRender) ─────────────────────────────────────────
async function gtInit() {
  // Aplica pré-seleção vinda do botão de atalho
  if (_gtPreSelected) {
    const { produto, canal } = _gtPreSelected;
    _gtPreSelected = null;
    const gProd = document.getElementById('gt-g-produto');
    const gCanal = document.getElementById('gt-g-canal');
    const lProd  = document.getElementById('gt-l-produto');
    const lCanal = document.getElementById('gt-l-canal');
    if (gProd)  gProd.value  = produto;
    if (gCanal) gCanal.value = canal;
    if (lProd)  lProd.value  = produto;
    if (lCanal) lCanal.value = canal;
    gtGrupoOnChange();
    gtLinhaOnChange();
  }
  await gtLoadData();
}

// ── LOAD DATA ─────────────────────────────────────────────────────────────────
async function gtLoadData() {
  if (!DEMO_MODE && _sb) {
    try {
      const [gRes, lRes] = await Promise.race([
        Promise.all([
          _sb.from('concremtp_grupos_tabela').select('*').eq('ativo', true).order('criado_em', { ascending: false }),
          _sb.from('concremtp_itens_tabela').select('*').eq('ativo', true).order('criado_em', { ascending: false }),
        ]),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000)),
      ]);
      _gtGrupos = gRes.data || [];
      _gtLinhas = (lRes.data || []).filter(l => l.criado_por !== null);
    } catch {
      _gtGrupos = []; _gtLinhas = [];
    }
  }
  gtRenderList();
}

// ── FORM: GRUPO ───────────────────────────────────────────────────────────────
function gtGrupoCorChange(cor) {
  const prev = document.getElementById('gt-g-cor-preview');
  const txt  = document.getElementById('gt-g-cor-nome');
  if (prev) prev.style.background = cor;
  const nome = (document.getElementById('gt-g-nome')?.value || 'NOVO GRUPO').trim() || 'NOVO GRUPO';
  if (txt) txt.textContent = nome;
  gtUpdatePreview();
}

function gtGrupoOnChange() {
  const nome = document.getElementById('gt-g-nome')?.value?.trim() || 'NOVO GRUPO';
  const txt  = document.getElementById('gt-g-cor-nome');
  if (txt) txt.textContent = nome || 'NOVO GRUPO';
  gtUpdatePreview();
}

async function gtCriarGrupo() {
  const produto = document.getElementById('gt-g-produto')?.value;
  const canal   = document.getElementById('gt-g-canal')?.value;
  const nome    = document.getElementById('gt-g-nome')?.value?.trim();
  const desc    = document.getElementById('gt-g-desc')?.value?.trim();
  const cor     = document.getElementById('gt-g-cor')?.value || '#1a3a1a';
  const erroEl  = document.getElementById('gt-g-erro');

  if (!produto) { _gtErro(erroEl,'Selecione o produto.'); return; }
  if (!canal)   { _gtErro(erroEl,'Selecione o canal.'); return; }
  if (!nome)    { _gtErro(erroEl,'Digite o nome do grupo.'); return; }
  _gtErro(erroEl,'');

  if (DEMO_MODE || !_sb) {
    _gtGrupos.unshift({ id: 'demo-'+Date.now(), produto, canal, nome, descricao: desc||null, cor_cabecalho: cor, ativo: true, criado_em: new Date().toISOString(), criado_por: currentUser?.id });
    _gtToast('Grupo criado! (modo demo)');
    _gtLimparGrupoForm();
    gtRenderList();
    return;
  }

  try {
    const { data, error } = await _sb.from('concremtp_grupos_tabela').insert({
      produto, canal, nome, descricao: desc||null, cor_cabecalho: cor,
      criado_por: currentUser?.id,
    }).select().single();
    if (error) throw error;
    _gtGrupos.unshift(data);
    _gtToast('Grupo criado com sucesso!');
    _gtLimparGrupoForm();
    gtRenderList();
    gtUpdatePreview();
  } catch (e) {
    _gtErro(erroEl, 'Erro ao salvar: ' + (e.message || e));
  }
}

function _gtLimparGrupoForm() {
  ['gt-g-produto','gt-g-canal','gt-g-nome','gt-g-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const cor = document.getElementById('gt-g-cor');
  if (cor) cor.value = '#1a3a1a';
  gtGrupoCorChange('#1a3a1a');
}

// ── FORM: LINHA ───────────────────────────────────────────────────────────────
function gtLinhaOnChange() {
  const prod  = document.getElementById('gt-l-produto')?.value;
  const canal = document.getElementById('gt-l-canal')?.value;
  _gtPopulateGrupoSelect('gt-l-grupo', prod, canal);
  gtUpdatePreview();
}

function _gtPopulateGrupoSelect(selectId, prod, canal) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  if (!prod || !canal) {
    sel.innerHTML = '<option value="">Selecione produto e canal primeiro…</option>';
    return;
  }
  const hardcoded = (GT_HARDCODED[prod] || []).map(n =>
    `<option value="${_gtEsc(n)}">${_gtEsc(n)}</option>`);
  const custom = _gtGrupos
    .filter(g => g.produto === prod && g.canal === canal)
    .map(g => `<option value="${_gtEsc(g.nome)}">${_gtEsc(g.nome)}</option>`);
  sel.innerHTML = '<option value="">Selecione o grupo…</option>' +
    hardcoded.join('') + custom.join('');
}

function gtTipoOnChange() {
  const tipo = document.getElementById('gt-l-tipo')?.value;
  const wrap = document.getElementById('gt-l-dinamico');
  if (!wrap) return;
  wrap.innerHTML = _gtCamposDinamicos(tipo);
  gtUpdatePreview();
}

function _gtCamposDinamicos(tipo) {
  if (tipo === 'porta') {
    return `
<div class="gt-field">
  <label class="gt-label">LINHA</label>
  <input id="gt-l-linha" class="gt-input" placeholder="Ex: COLMEIA — SARRAFO 3mm" oninput="gtUpdatePreview()">
</div>
<div class="gt-field">
  <label class="gt-label">ACABAMENTO</label>
  <input id="gt-l-acab" class="gt-input" placeholder="Ex: MEL LACCA BIANCO" oninput="gtUpdatePreview()">
</div>
<div class="gt-field">
  <label class="gt-label">PREÇOS POR LARGURA</label>
  <div class="gt-widths-grid">
    ${[60,70,80,90,100].map(w => `
    <div class="gt-width-field">
      <label class="gt-width-label">${w} cm</label>
      <input type="number" id="gt-l-p${w}" class="gt-input gt-input-sm"
        min="0" step="0.01" placeholder="0.00" oninput="gtUpdatePreview()">
    </div>`).join('')}
  </div>
  <label class="gt-check-label">
    <input type="checkbox" id="gt-l-add110" onchange="gtToggle110()">
    Adicionar largura 110 cm
  </label>
  <div id="gt-l-110-wrap" style="display:none;margin-top:8px">
    <div class="gt-width-field">
      <label class="gt-width-label">110 cm</label>
      <input type="number" id="gt-l-p110" class="gt-input gt-input-sm"
        min="0" step="0.01" placeholder="0.00" oninput="gtUpdatePreview()">
    </div>
  </div>
</div>
<div class="gt-field">
  <label class="gt-label">POSIÇÃO NA TABELA</label>
  <select id="gt-l-posicao" class="gt-input">
    <option value="end">No final do grupo (padrão)</option>
    <option value="start">No início do grupo</option>
  </select>
</div>`;
  }

  if (tipo === 'batente') {
    return `
<div class="gt-field-row">
  <div class="gt-field">
    <label class="gt-label">LARGURA</label>
    <input id="gt-l-largura" class="gt-input" placeholder="Ex: 5,5 cm" oninput="gtUpdatePreview()">
  </div>
  <div class="gt-field">
    <label class="gt-label">ACABAMENTO</label>
    <input id="gt-l-acab" class="gt-input" placeholder="Ex: ELO BRANCO" oninput="gtUpdatePreview()">
  </div>
</div>
<div class="gt-field-row">
  <div class="gt-field">
    <label class="gt-label">PREÇO DE VENDA</label>
    <input type="number" id="gt-l-preco" class="gt-input" min="0" step="0.01" placeholder="0.00" oninput="gtUpdatePreview()">
  </div>
  <div class="gt-field">
    <label class="gt-label">C/ PROTECT+ (opcional)</label>
    <input type="number" id="gt-l-protect" class="gt-input" min="0" step="0.01" placeholder="0.00" oninput="gtUpdatePreview()">
  </div>
</div>`;
  }

  if (tipo === 'rodape') {
    return `
<div class="gt-field-row">
  <div class="gt-field">
    <label class="gt-label">LARGURA</label>
    <input id="gt-l-largura" class="gt-input" placeholder="Ex: 5 cm" oninput="gtUpdatePreview()">
  </div>
  <div class="gt-field">
    <label class="gt-label">ACABAMENTO</label>
    <input id="gt-l-acab" class="gt-input" placeholder="Ex: FENDI / GRAFITE" oninput="gtUpdatePreview()">
  </div>
</div>
<div class="gt-field-row">
  <div class="gt-field">
    <label class="gt-label">PREÇO RÉGUA</label>
    <input type="number" id="gt-l-regua" class="gt-input" min="0" step="0.01" placeholder="0.00" oninput="gtUpdatePreview()">
  </div>
  <div class="gt-field">
    <label class="gt-label">PREÇO METRO LINEAR</label>
    <input type="number" id="gt-l-ml" class="gt-input" min="0" step="0.01" placeholder="0.00" oninput="gtUpdatePreview()">
  </div>
</div>`;
  }

  if (tipo === 'adicional' || tipo === 'ferragem') {
    return `
<div class="gt-field-row">
  <div class="gt-field">
    <label class="gt-label">DESCRIÇÃO</label>
    <input id="gt-l-desc" class="gt-input" placeholder="Descrição do item" oninput="gtUpdatePreview()">
  </div>
  <div class="gt-field">
    <label class="gt-label">VALOR</label>
    <input type="number" id="gt-l-valor" class="gt-input" min="0" step="0.01" placeholder="0.00" oninput="gtUpdatePreview()">
  </div>
</div>`;
  }
  return '';
}

function gtToggle110() {
  const cb   = document.getElementById('gt-l-add110');
  const wrap = document.getElementById('gt-l-110-wrap');
  if (wrap) wrap.style.display = cb?.checked ? '' : 'none';
  gtUpdatePreview();
}

async function gtAdicionarLinha() {
  const produto = document.getElementById('gt-l-produto')?.value;
  const canal   = document.getElementById('gt-l-canal')?.value;
  const grupo   = document.getElementById('gt-l-grupo')?.value;
  const tipo    = document.getElementById('gt-l-tipo')?.value;
  const erroEl  = document.getElementById('gt-l-erro');

  if (!produto) { _gtErro(erroEl,'Selecione o produto.'); return; }
  if (!canal)   { _gtErro(erroEl,'Selecione o canal.'); return; }
  if (!grupo)   { _gtErro(erroEl,'Selecione o grupo/coleção.'); return; }
  if (!tipo)    { _gtErro(erroEl,'Selecione o tipo da linha.'); return; }
  _gtErro(erroEl,'');

  const item = {
    produto, canal, ativo: true,
    larguras: null, preco_venda: null, preco_protect: null,
    preco_regua: null, preco_ml: null,
    colecao: null, linha: null, acabamento: null,
  };

  if (tipo === 'porta') {
    const linhaVal = document.getElementById('gt-l-linha')?.value?.trim();
    const acabVal  = document.getElementById('gt-l-acab')?.value?.trim();
    if (!linhaVal) { _gtErro(erroEl,'Digite o nome da linha.'); return; }
    if (!acabVal)  { _gtErro(erroEl,'Digite o acabamento.'); return; }
    item.tipo      = 'porta';
    item.colecao   = grupo;
    item.acabamento = acabVal;
    item.linha     = linhaVal;
    const larguras = {};
    [60,70,80,90,100].forEach(w => {
      const v = parseFloat(document.getElementById(`gt-l-p${w}`)?.value || 0);
      if (v > 0) larguras[String(w)] = v;
    });
    if (document.getElementById('gt-l-add110')?.checked) {
      const v110 = parseFloat(document.getElementById('gt-l-p110')?.value || 0);
      if (v110 > 0) larguras['110'] = v110;
    }
    if (!Object.keys(larguras).length) { _gtErro(erroEl,'Informe ao menos um preço por largura.'); return; }
    item.larguras = larguras;

  } else if (tipo === 'batente') {
    const largVal = document.getElementById('gt-l-largura')?.value?.trim();
    const acabVal = document.getElementById('gt-l-acab')?.value?.trim();
    if (!acabVal) { _gtErro(erroEl,'Digite o acabamento.'); return; }
    item.tipo = 'batente'; item.colecao = null;
    item.linha     = largVal || null;
    item.acabamento = acabVal;
    item.preco_venda   = parseFloat(document.getElementById('gt-l-preco')?.value || 0) || null;
    item.preco_protect = parseFloat(document.getElementById('gt-l-protect')?.value || 0) || null;

  } else if (tipo === 'rodape') {
    const largVal = document.getElementById('gt-l-largura')?.value?.trim();
    const acabVal = document.getElementById('gt-l-acab')?.value?.trim();
    if (!acabVal) { _gtErro(erroEl,'Digite o acabamento.'); return; }
    item.tipo = 'rodape'; item.colecao = null;
    item.linha     = largVal || null;
    item.acabamento = acabVal;
    item.preco_regua = parseFloat(document.getElementById('gt-l-regua')?.value || 0) || null;
    item.preco_ml    = parseFloat(document.getElementById('gt-l-ml')?.value || 0) || null;

  } else if (tipo === 'adicional' || tipo === 'ferragem') {
    const descVal  = document.getElementById('gt-l-desc')?.value?.trim();
    const valorVal = parseFloat(document.getElementById('gt-l-valor')?.value || 0);
    if (!descVal) { _gtErro(erroEl,'Digite a descrição.'); return; }
    item.tipo = tipo; item.colecao = null; item.linha = null;
    item.acabamento = descVal;
    item.preco_venda = valorVal || null;
  }

  if (DEMO_MODE || !_sb) {
    _gtLinhas.unshift({ ...item, id: 'demo-'+Date.now(), criado_em: new Date().toISOString(), criado_por: currentUser?.id });
    _gtToast('Linha adicionada! (modo demo)');
    _gtLimparLinhaForm();
    gtRenderList();
    return;
  }

  try {
    const { data, error } = await _sb.from('concremtp_itens_tabela').insert({
      ...item, criado_por: currentUser?.id, criado_em: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    _gtLinhas.unshift(data);
    _gtToast('Linha adicionada com sucesso!');
    _gtLimparLinhaForm();
    gtRenderList();
    gtUpdatePreview();
  } catch (e) {
    _gtErro(erroEl,'Erro ao salvar: '+(e.message||e));
  }
}

function _gtLimparLinhaForm() {
  ['gt-l-produto','gt-l-canal','gt-l-grupo','gt-l-tipo'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const wrap = document.getElementById('gt-l-dinamico');
  if (wrap) wrap.innerHTML = '';
  const grp = document.getElementById('gt-l-grupo');
  if (grp) grp.innerHTML = '<option value="">Selecione produto e canal primeiro…</option>';
}

// ── PREVIEW ───────────────────────────────────────────────────────────────────
function gtUpdatePreview() {
  const prod  = document.getElementById('gt-l-produto')?.value ||
                document.getElementById('gt-g-produto')?.value;
  const canal = document.getElementById('gt-l-canal')?.value  ||
                document.getElementById('gt-g-canal')?.value;

  const body  = document.getElementById('gt-preview-body');
  const badge = document.getElementById('gt-preview-badge');
  if (!body) return;

  if (!prod || !canal) {
    body.innerHTML = `<div class="gt-preview-empty">
      <i class="ti ti-table" style="font-size:36px;opacity:.25"></i>
      <p>Selecione um produto e canal para ver o preview</p>
    </div>`;
    if (badge) badge.style.display = 'none';
    return;
  }

  if (badge) {
    badge.textContent = _gtProdLabel(prod) + ' · ' + _gtCanalLabel(canal);
    badge.style.display = '';
  }

  // Coleta estado do formulário de novo grupo
  const novoGrupoNome = document.getElementById('gt-g-nome')?.value?.trim() || '';
  const novoGrupoDesc = document.getElementById('gt-g-desc')?.value?.trim() || '';
  const novoGrupoCor  = document.getElementById('gt-g-cor')?.value || '#1a3a1a';
  const novoGrupoProd = document.getElementById('gt-g-produto')?.value;
  const novoGrupoCanal= document.getElementById('gt-g-canal')?.value;
  const showNovoGrupo = novoGrupoNome && novoGrupoProd === prod && novoGrupoCanal === canal;

  // Coleta estado do formulário de nova linha
  const tipo     = document.getElementById('gt-l-tipo')?.value;
  const lGrupo   = document.getElementById('gt-l-grupo')?.value;
  const lLinha   = document.getElementById('gt-l-linha')?.value?.trim()   || '';
  const lAcab    = document.getElementById('gt-l-acab')?.value?.trim()    || '';
  const lDesc    = document.getElementById('gt-l-desc')?.value?.trim()    || '';
  const lLargura = document.getElementById('gt-l-largura')?.value?.trim() || '';
  const showNovaLinha = tipo && (lLinha || lAcab || lDesc || lLargura);

  let html = '';

  if (['portasLacca','portasUV','portasELO'].includes(prod)) {
    // Porta sections: tabela de larguras
    let colecoes = [];
    try {
      if (prod === 'portasLacca') {
        const k = portasLaccaData[canal] ? canal : 'distribuidora';
        colecoes = portasLaccaData[k]?.colecoes || [];
      } else if (prod === 'portasUV') {
        const k = portasUVData[canal] ? canal : 'distribuidora';
        colecoes = portasUVData[k]?.colecoes || [];
      } else if (prod === 'portasELO') {
        colecoes = portasELOData?.colecoes || [];
      }
    } catch {}

    // Mostra primeiros 2 grupos apenas para não pesar
    const widths = prod === 'portasELO' ? [60,70,80,90,100,110] : [60,70,80,90,100];
    html += `<div class="gt-preview-table-wrap"><table class="gt-preview-table">
      <thead><tr>
        <th>LINHA / ACABAMENTO</th>
        ${widths.map(w=>`<th>${w}</th>`).join('')}
      </tr></thead><tbody>`;

    colecoes.slice(0,2).forEach(col => {
      html += `<tr class="gt-preview-col-hdr"><td colspan="${widths.length+1}"
        style="background:#1a3a1a;color:#fff;font-size:11px;font-weight:700;padding:6px 10px;letter-spacing:.5px">
        ${_gtEsc(col.nome)}${col.sub ? ' <span style="font-weight:400;opacity:.7;font-size:10px">· '+_gtEsc(col.sub)+'</span>' : ''}
      </td></tr>`;

      col.grupos?.slice(0,1).forEach(g => {
        html += `<tr class="gt-preview-sep"><td colspan="${widths.length+1}"
          style="background:var(--color-primary-bg);color:var(--color-primary-dark);font-size:11px;font-weight:600;padding:4px 10px">
          ${_gtEsc(g.nome)}
        </td></tr>`;
        g.itens?.slice(0,2).forEach(it => {
          html += `<tr><td style="font-size:12px;padding:4px 8px">${_gtEsc(it.linha)}</td>
            ${widths.map((_,i) => `<td style="text-align:right;font-size:12px;padding:4px 8px">${it.p[i]!=null?_gtFmt(it.p[i]):'—'}</td>`).join('')}
          </tr>`;
        });
        // Nova linha no primeiro grupo
        if (showNovaLinha && tipo === 'porta' && lGrupo === col.nome) {
          const prices = widths.map(w => {
            const v = parseFloat(document.getElementById(`gt-l-p${w}`)?.value||0);
            return v > 0 ? _gtFmt(v) : '—';
          });
          html += `<tr class="gt-preview-new"><td style="font-size:12px;padding:4px 8px">
            <span class="gt-badge-novo">NOVO</span> ${_gtEsc(lLinha||'Nova linha')}
            ${lAcab ? '<br><small style="color:#888">'+_gtEsc(lAcab)+'</small>' : ''}
          </td>${prices.map(p=>`<td style="text-align:right;font-size:12px;padding:4px 8px;color:var(--color-primary)">${p}</td>`).join('')}</tr>`;
        }
      });
    });

    // Novo grupo em construção
    if (showNovoGrupo) {
      html += `<tr><td colspan="${widths.length+1}" style="background:${_gtEsc(novoGrupoCor)};color:#fff;font-size:11px;font-weight:700;padding:6px 10px;position:relative">
        <span class="gt-badge-novo-grupo">NOVO GRUPO</span>
        ${_gtEsc(novoGrupoNome)}
        ${novoGrupoDesc ? '<span style="font-weight:400;opacity:.7;font-size:10px"> · '+_gtEsc(novoGrupoDesc)+'</span>' : ''}
      </td></tr>
      <tr><td colspan="${widths.length+1}" style="color:#aaa;font-style:italic;font-size:12px;padding:6px 10px;border:2px dashed var(--color-primary)">
        Linhas aparecerão aqui…
      </td></tr>`;
    }

    html += `</tbody></table></div>`;

  } else {
    // Acab sections: lista simplificada
    let grupos = [];
    try {
      if (prod === 'laccaAcab')  grupos = Object.entries(laccaAcabBase).map(([k,v])=>({key:k,title:v.title}));
      if (prod === 'melamAcab')  grupos = Object.entries(melamAcabBase).map(([k,v])=>({key:k,title:v.title}));
      if (prod === 'batenteELO') grupos = [{ key:'batente', title: eloAcabBase.batente.title }];
    } catch {}

    html += `<div class="gt-preview-acab">`;
    grupos.slice(0,3).forEach(g => {
      html += `<div class="gt-preview-acab-grp">
        <div class="gt-preview-acab-hdr">${_gtEsc(g.title)}</div>`;
      let source = null;
      try {
        if (prod === 'laccaAcab')  source = laccaAcabBase[g.key];
        if (prod === 'melamAcab')  source = melamAcabBase[g.key];
        if (prod === 'batenteELO') source = eloAcabBase.batente;
      } catch {}
      if (source?.grupos) {
        source.grupos.slice(0,1).forEach(gr => {
          gr.itens?.slice(0,2).forEach(it => {
            const isRodape = it.precoRegua !== undefined;
            html += `<div class="gt-preview-acab-row">
              <span>${_gtEsc(it.acab)}</span>
              <span style="color:var(--color-primary)">${isRodape ? _gtFmt(it.precoRegua)+'/régua' : _gtFmt(it.preco)}</span>
            </div>`;
          });
        });
      }
      if (showNovaLinha && (tipo === 'batente' || tipo === 'rodape')) {
        html += `<div class="gt-preview-acab-row gt-preview-new">
          <span><span class="gt-badge-novo">NOVO</span> ${_gtEsc(lAcab||lDesc||'Novo acabamento')}</span>
          <span style="color:var(--color-primary)">
            ${tipo==='rodape' ? (_gtFmt(parseFloat(document.getElementById('gt-l-regua')?.value||0))+'/régua') :
              _gtFmt(parseFloat(document.getElementById('gt-l-preco')?.value||0))}
          </span>
        </div>`;
      }
      html += `</div>`;
    });
    if (showNovoGrupo) {
      html += `<div class="gt-preview-acab-grp gt-preview-new">
        <div class="gt-preview-acab-hdr" style="background:${_gtEsc(novoGrupoCor)}">
          <span class="gt-badge-novo-grupo">NOVO GRUPO</span> ${_gtEsc(novoGrupoNome)}
        </div>
        <div style="padding:8px 10px;color:#aaa;font-style:italic;font-size:12px">Linhas aparecerão aqui…</div>
      </div>`;
    }
    html += `</div>`;
  }

  body.innerHTML = html;
}

// ── LISTA ─────────────────────────────────────────────────────────────────────
function gtSwitchTab(tab) {
  _gtActiveTab = tab;
  ['grupos','linhas'].forEach(t => {
    document.getElementById(`gt-tab-${t}`)?.classList.toggle('active', t === tab);
  });
  gtRenderList();
}

function gtRenderList() {
  const el = document.getElementById('gt-list-content');
  if (!el) return;
  el.innerHTML = _gtActiveTab === 'grupos' ? _gtGruposList() : _gtLinhasList();
}

function _gtGruposList() {
  if (!_gtGrupos.length) return '<div class="gt-list-empty">Nenhum grupo criado ainda.</div>';
  const rows = _gtGrupos.map(g => `
    <tr>
      <td>${_gtEsc(_gtProdLabel(g.produto))}</td>
      <td><span class="gt-badge-canal">${_gtEsc(_gtCanalLabel(g.canal))}</span></td>
      <td><strong>${_gtEsc(g.nome)}</strong></td>
      <td style="color:#718096;font-size:12px">${_gtEsc(g.descricao||'—')}</td>
      <td><div class="gt-cor-box" style="background:${_gtEsc(g.cor_cabecalho||'#1a3a1a')}" title="${_gtEsc(g.cor_cabecalho||'')}"></div></td>
      <td style="color:#718096;font-size:12px">${g.criado_em ? new Date(g.criado_em).toLocaleDateString('pt-BR') : '—'}</td>
      <td class="gt-acoes">
        <button class="gt-btn-edit" onclick="gtAbrirEditarGrupo('${_gtEsc(g.id)}')">Editar</button>
        <button class="gt-btn-del"  onclick="gtExcluirGrupo('${_gtEsc(g.id)}')">Excluir</button>
      </td>
    </tr>`).join('');
  return `<div class="gt-table-wrap"><table class="gt-list-table">
    <thead><tr>
      <th>Produto</th><th>Canal</th><th>Nome do Grupo</th>
      <th>Descrição</th><th>Cor</th><th>Criado em</th><th>Ações</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function _gtLinhasList() {
  if (!_gtLinhas.length) return '<div class="gt-list-empty">Nenhuma linha criada ainda.</div>';
  const rows = _gtLinhas.map(l => {
    const cor = GT_TIPO_COLORS[l.tipo] || '#64748b';
    return `<tr>
      <td>${_gtEsc(_gtProdLabel(l.produto))}</td>
      <td><span class="gt-badge-canal">${_gtEsc(_gtCanalLabel(l.canal))}</span></td>
      <td style="font-size:12px;color:#718096">${_gtEsc(l.colecao||l.linha||'—')}</td>
      <td><span class="gt-badge-tipo" style="background:${cor}20;color:${cor};border-color:${cor}40">
        ${_gtEsc(GT_TIPO_LABELS[l.tipo]||l.tipo)}
      </span></td>
      <td>${_gtEsc(l.linha||l.acabamento||'—')}</td>
      <td style="font-size:12px;color:#718096">${_gtEsc(l.acabamento||'—')}</td>
      <td style="color:#718096;font-size:12px">${l.criado_em ? new Date(l.criado_em).toLocaleDateString('pt-BR') : '—'}</td>
      <td class="gt-acoes">
        <button class="gt-btn-edit" onclick="gtAbrirEditarLinha('${_gtEsc(l.id)}')">Editar</button>
        <button class="gt-btn-del"  onclick="gtRemoverLinha('${_gtEsc(l.id)}')">Remover</button>
      </td>
    </tr>`;
  }).join('');
  return `<div class="gt-table-wrap"><table class="gt-list-table">
    <thead><tr>
      <th>Produto</th><th>Canal</th><th>Grupo</th>
      <th>Tipo</th><th>Linha / Descrição</th><th>Acabamento</th>
      <th>Criado em</th><th>Ações</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

// ── EDITAR GRUPO ──────────────────────────────────────────────────────────────
function gtAbrirEditarGrupo(id) {
  const g = _gtGrupos.find(x => x.id === id);
  if (!g) return;
  _gtEditGrupo = g;
  _gtEditLinha = null;
  document.getElementById('gt-modal-title').textContent = 'Editar Grupo';
  const prodOpts = GT_PRODUTOS.map(p =>
    `<option value="${p.value}" ${p.value===g.produto?'selected':''}>${_gtEsc(p.label)}</option>`).join('');
  const canalOpts = GT_CANAIS.map(c =>
    `<option value="${c.value}" ${c.value===g.canal?'selected':''}>${_gtEsc(c.label)}</option>`).join('');
  document.getElementById('gt-modal-body').innerHTML = `
    <div class="gt-form">
      <div class="gt-field-row">
        <div class="gt-field"><label class="gt-label">PRODUTO</label>
          <select id="gtm-produto" class="gt-input">${prodOpts}</select></div>
        <div class="gt-field"><label class="gt-label">CANAL</label>
          <select id="gtm-canal" class="gt-input">${canalOpts}</select></div>
      </div>
      <div class="gt-field"><label class="gt-label">NOME DO GRUPO</label>
        <input id="gtm-nome" class="gt-input" value="${_gtEsc(g.nome)}"
          oninput="this.value=this.value.toUpperCase()"></div>
      <div class="gt-field"><label class="gt-label">DESCRIÇÃO (opcional)</label>
        <input id="gtm-desc" class="gt-input" value="${_gtEsc(g.descricao||'')}"></div>
      <div class="gt-field"><label class="gt-label">COR DO CABEÇALHO</label>
        <div class="gt-color-row">
          <input type="color" id="gtm-cor" class="gt-color-pick" value="${_gtEsc(g.cor_cabecalho||'#1a3a1a')}">
          <div class="gt-col-hdr-preview" style="background:${_gtEsc(g.cor_cabecalho||'#1a3a1a')}">
            <span style="color:#fff;font-size:12px;font-weight:700">${_gtEsc(g.nome)}</span>
          </div>
        </div>
      </div>
      <p id="gtm-erro" class="gt-erro"></p>
    </div>`;
  _gtAbrirModal();
}

async function gtSalvarEdicao() {
  if (_gtEditGrupo) {
    const id      = _gtEditGrupo.id;
    const produto = document.getElementById('gtm-produto')?.value;
    const canal   = document.getElementById('gtm-canal')?.value;
    const nome    = document.getElementById('gtm-nome')?.value?.trim();
    const desc    = document.getElementById('gtm-desc')?.value?.trim();
    const cor     = document.getElementById('gtm-cor')?.value || '#1a3a1a';
    const erroEl  = document.getElementById('gtm-erro');
    if (!nome) { _gtErro(erroEl,'Nome obrigatório.'); return; }
    _gtErro(erroEl,'');

    if (!(DEMO_MODE || !_sb)) {
      try {
        const { error } = await _sb.from('concremtp_grupos_tabela')
          .update({ produto, canal, nome, descricao: desc||null, cor_cabecalho: cor }).eq('id', id);
        if (error) throw error;
      } catch (e) { _gtErro(erroEl,'Erro: '+(e.message||e)); return; }
    }
    const idx = _gtGrupos.findIndex(x => x.id === id);
    if (idx >= 0) Object.assign(_gtGrupos[idx], { produto, canal, nome, descricao: desc||null, cor_cabecalho: cor });
    _gtToast('Grupo atualizado!');
    gtFecharModal(); gtRenderList();
    return;
  }

  if (_gtEditLinha) {
    const id      = _gtEditLinha.id;
    const erroEl  = document.getElementById('gtm-erro');
    const updates = {
      produto:  document.getElementById('gtm-l-produto')?.value,
      canal:    document.getElementById('gtm-l-canal')?.value,
    };
    const acab    = document.getElementById('gtm-l-acab')?.value?.trim();
    const desc    = document.getElementById('gtm-l-desc')?.value?.trim();
    if (acab)  updates.acabamento = acab;
    if (desc)  updates.acabamento = desc;
    const preco   = parseFloat(document.getElementById('gtm-l-preco')?.value || 0);
    if (!isNaN(preco)) updates.preco_venda = preco || null;

    if (!(DEMO_MODE || !_sb)) {
      try {
        const { error } = await _sb.from('concremtp_itens_tabela').update(updates).eq('id', id);
        if (error) throw error;
      } catch (e) { _gtErro(erroEl,'Erro: '+(e.message||e)); return; }
    }
    const idx = _gtLinhas.findIndex(x => x.id === id);
    if (idx >= 0) Object.assign(_gtLinhas[idx], updates);
    _gtToast('Linha atualizada!');
    gtFecharModal(); gtRenderList();
  }
}

async function gtExcluirGrupo(id) {
  if (!confirm('Excluir este grupo? Esta ação é irreversível.')) return;
  if (!(DEMO_MODE || !_sb)) {
    try {
      await _sb.from('concremtp_grupos_tabela').update({ ativo: false }).eq('id', id);
    } catch (e) { _gtToast('Erro ao excluir: '+(e.message||e), true); return; }
  }
  _gtGrupos = _gtGrupos.filter(g => g.id !== id);
  _gtToast('Grupo excluído.');
  gtRenderList();
  gtUpdatePreview();
}

// ── EDITAR LINHA ──────────────────────────────────────────────────────────────
function gtAbrirEditarLinha(id) {
  const l = _gtLinhas.find(x => x.id === id);
  if (!l) return;
  _gtEditLinha = l;
  _gtEditGrupo = null;
  document.getElementById('gt-modal-title').textContent = 'Editar Linha';
  const prodOpts  = GT_PRODUTOS.map(p =>
    `<option value="${p.value}" ${p.value===l.produto?'selected':''}>${_gtEsc(p.label)}</option>`).join('');
  const canalOpts = GT_CANAIS.map(c =>
    `<option value="${c.value}" ${c.value===l.canal?'selected':''}>${_gtEsc(c.label)}</option>`).join('');
  document.getElementById('gt-modal-body').innerHTML = `
    <div class="gt-form">
      <div class="gt-field-row">
        <div class="gt-field"><label class="gt-label">PRODUTO</label>
          <select id="gtm-l-produto" class="gt-input">${prodOpts}</select></div>
        <div class="gt-field"><label class="gt-label">CANAL</label>
          <select id="gtm-l-canal" class="gt-input">${canalOpts}</select></div>
      </div>
      <div class="gt-field"><label class="gt-label">ACABAMENTO / DESCRIÇÃO</label>
        <input id="${l.tipo==='adicional'||l.tipo==='ferragem'?'gtm-l-desc':'gtm-l-acab'}"
          class="gt-input" value="${_gtEsc(l.acabamento||'')}"></div>
      ${l.preco_venda != null ? `
      <div class="gt-field"><label class="gt-label">PREÇO DE VENDA</label>
        <input type="number" id="gtm-l-preco" class="gt-input" min="0" step="0.01"
          value="${l.preco_venda||0}"></div>` : ''}
      <p id="gtm-erro" class="gt-erro"></p>
    </div>`;
  _gtAbrirModal();
}

async function gtRemoverLinha(id) {
  if (!confirm('Remover esta linha?')) return;
  if (!(DEMO_MODE || !_sb)) {
    try {
      await _sb.from('concremtp_itens_tabela').update({ ativo: false }).eq('id', id);
    } catch (e) { _gtToast('Erro: '+(e.message||e), true); return; }
  }
  _gtLinhas = _gtLinhas.filter(l => l.id !== id);
  _gtToast('Linha removida.');
  gtRenderList();
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function _gtAbrirModal() {
  const modal = document.getElementById('gt-edit-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('mi-modal-open'));
}

function gtFecharModal() {
  const modal = document.getElementById('gt-edit-modal');
  if (!modal) return;
  modal.classList.remove('mi-modal-open');
  setTimeout(() => { modal.style.display = 'none'; }, 200);
  _gtEditGrupo = null; _gtEditLinha = null;
}

// ── BOTÃO DE ATALHO ───────────────────────────────────────────────────────────
const _GT_TABLE_SECTIONS = new Set([
  'portasLacca','portasUV','portasELO','laccaAcab','melamAcab','batenteELO'
]);

function _gtInjectShortcutBtn() {
  if (!temPermissao('adicionar_itens_tabela')) return;
  if (!_GT_TABLE_SECTIONS.has(currentSection)) return;
  if (document.querySelector('.gt-shortcut-btn')) return; // já injetado

  const header = document.querySelector('.page-header');
  if (!header) return;

  const prod  = currentSection;
  const canal = currentChannel;
  const btn   = document.createElement('button');
  btn.className = 'gt-shortcut-btn';
  btn.innerHTML = '<i class="ti ti-table"></i> ＋ Grupo / Linha';
  btn.onclick = () => gtOpenFromShortcut(prod, canal);
  header.appendChild(btn);
}

function gtOpenFromShortcut(produto, canal) {
  _gtPreSelected = { produto, canal };
  const navBtn = document.querySelector('.nav-item[data-section="gerenciarTabelas"]');
  if (navBtn) navBtn.click();
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
function _gtErro(el, msg) {
  if (el) { el.textContent = msg; el.style.color = msg ? '#dc2626' : ''; }
}

let _gtToastTimer;
function _gtToast(msg, isError) {
  let t = document.getElementById('gt-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'gt-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'gm-toast gm-toast-show ' + (isError ? 'gm-toast-error' : 'gm-toast-ok');
  clearTimeout(_gtToastTimer);
  _gtToastTimer = setTimeout(() => { if(t) t.className = 'gm-toast'; }, 3500);
}

// ── HOOK PÓS-RENDER ───────────────────────────────────────────────────────────
// Estende onAfterRender para suportar gerenciarTabelas e injetar botão de atalho
const _gtOrigAfterRender = onAfterRender;
onAfterRender = function(section) {
  _gtOrigAfterRender(section);
  if (section === 'gerenciarTabelas') gtInit();
  _gtInjectShortcutBtn();
};
