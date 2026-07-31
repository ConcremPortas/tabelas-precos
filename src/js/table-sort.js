// ── ORDENAÇÃO DE TABELAS — INFRAESTRUTURA COMPARTILHADA ──────────────────────
// JavaScript puro, sem módulos, sem dependências. Exposto em window.AppTableSort.
//
// Ordena SEMPRE o array de dados, nunca o DOM. Cada tela mantém o próprio estado
// e chama sortRows() depois dos filtros e antes da renderização.
//
// Para dar ordenação a uma tabela nova:
//   1. declare as colunas: [{ key, label, type }, ...]
//   2. guarde um estado: var _xSort = AppTableSort.newState();
//   3. no cabeçalho: AppTableSort.header(col, _xSort, "xSortBy('" + col.key + "')")
//   4. no clique: _xSort = AppTableSort.nextState(_xSort, key); re-renderize
//   5. antes de renderizar: rows = AppTableSort.sortRows(rows, _xSort, COLS)

(function() {
  'use strict';

  // Instância única — criar um Collator por comparação é caro.
  var collator = new Intl.Collator('pt-BR', { numeric: true, sensitivity: 'base' });

  // Reconhece Date de qualquer contexto (instanceof falha entre realms, p.ex.
  // objeto vindo de um iframe ou de um contexto de teste).
  function isDate(v) {
    return Object.prototype.toString.call(v) === '[object Date]';
  }

  // ── VALORES AUSENTES ────────────────────────────────────────────────────────
  // Zero, false e string "0" NÃO são vazios: podem ser valor de negócio válido.
  function isEmpty(v) {
    if (v === null || v === undefined) return true;
    if (typeof v === 'number') return isNaN(v);
    if (typeof v === 'string') return v.trim() === '';
    if (isDate(v)) return isNaN(v.getTime());
    return false;
  }

  // ── CONVERSORES ─────────────────────────────────────────────────────────────

  // Número simples. Não tenta interpretar formatação brasileira.
  function toNumber(v) {
    if (typeof v === 'number') return v;
    if (v === null || v === undefined) return NaN;
    if (typeof v === 'string') {
      var s = v.trim();
      return s === '' ? NaN : parseFloat(s);
    }
    return NaN;
  }

  // Moeda. Aceita número puro e, só aqui, texto já formatado em pt-BR
  // ("R$ 1.234,56"). Normalização deliberadamente restrita a este tipo.
  function toCurrency(v) {
    if (typeof v === 'number') return v;
    if (typeof v !== 'string') return NaN;
    var s = v.replace(/\s| /g, '').replace(/R\$/gi, '');
    if (s === '') return NaN;
    var temVirgula = s.indexOf(',') >= 0;
    var temPonto   = s.indexOf('.') >= 0;
    if (temVirgula && temPonto) {
      // "1.234,56" → ponto é separador de milhar
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (temVirgula) {
      s = s.replace(',', '.');
    }
    return parseFloat(s);
  }

  // Percentual: mesmo tratamento da moeda, sem o símbolo.
  function toPercent(v) {
    if (typeof v === 'number') return v;
    if (typeof v !== 'string') return NaN;
    return toCurrency(v.replace(/%/g, ''));
  }

  // Data/hora → timestamp. Nunca usa new Date() sobre "31/07/2026", que é
  // interpretado como mês 31 em muitos ambientes.
  function toTime(v) {
    if (isDate(v)) return v.getTime();
    if (typeof v === 'number') return v;
    if (typeof v !== 'string') return NaN;
    var s = v.trim();
    if (s === '') return NaN;

    // dd/mm/aaaa [hh:mm[:ss]]
    var br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ ,]+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (br) {
      return new Date(+br[3], +br[2] - 1, +br[1],
                      +(br[4] || 0), +(br[5] || 0), +(br[6] || 0)).getTime();
    }
    // ISO e demais formatos reconhecidos pelo motor
    var t = Date.parse(s);
    return isNaN(t) ? NaN : t;
  }

  // ── COLUNAS ─────────────────────────────────────────────────────────────────

  function findCol(cols, key) {
    if (!cols || !key) return null;
    for (var i = 0; i < cols.length; i++) {
      if (cols[i].key === key) return cols[i];
    }
    return null;
  }

  function isSortable(col) {
    return !!col && col.sortable !== false;
  }

  // Valor bruto do registro para a coluna: getValue tem precedência, o que
  // permite ordenar por valor calculado usando a MESMA função da renderização.
  function rawValue(row, col) {
    if (typeof col.getValue === 'function') return col.getValue(row);
    return row ? row[col.key] : undefined;
  }

  // Valor já convertido para o tipo da coluna, pronto para comparar.
  function comparableValue(row, col) {
    var v = rawValue(row, col);
    switch (col.type) {
      case 'number':
      case 'percentage': return col.type === 'percentage' ? toPercent(v) : toNumber(v);
      case 'currency':   return toCurrency(v);
      case 'date':
      case 'datetime':   return toTime(v);
      case 'boolean':    return v === null || v === undefined ? v : !!v;
      case 'status':     return v;
      default:           return v;   // text, natural-text, custom
    }
  }

  // ── COMPARAÇÃO ──────────────────────────────────────────────────────────────
  // Compara dois valores JÁ convertidos, sem aplicar direção nem regra de vazio.
  function compareValues(a, b, type, col) {
    switch (type) {
      case 'number':
      case 'percentage':
      case 'currency':
      case 'date':
      case 'datetime':
        return a === b ? 0 : (a < b ? -1 : 1);

      case 'boolean':
        return a === b ? 0 : (a ? -1 : 1);   // verdadeiro primeiro no crescente

      case 'status': {
        var ordem = (col && col.statusOrder) || [];
        var ia = ordem.indexOf(a);
        var ib = ordem.indexOf(b);
        // Fora da lista vai para o fim, mantendo ordem textual entre si.
        if (ia === -1 && ib === -1) return collator.compare(String(a), String(b));
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia === ib ? 0 : (ia < ib ? -1 : 1);
      }

      default:
        return collator.compare(String(a), String(b));   // text, natural-text
    }
  }

  // ── ORDENAÇÃO ───────────────────────────────────────────────────────────────
  // Devolve SEMPRE um array novo. Nunca ordena o array recebido.
  function sortRows(rows, state, cols) {
    if (!rows || !rows.length) return rows;
    if (!state || !state.key || !state.direction) return rows;

    var col = findCol(cols, state.key);
    if (!isSortable(col)) return rows;

    var dir = state.direction === 'desc' ? -1 : 1;
    var vaziosNoFim = col.emptyLast !== false;
    var tipo = col.type || 'text';

    return rows.slice().sort(function(ra, rb) {
      var a = comparableValue(ra, col);
      var b = comparableValue(rb, col);

      if (vaziosNoFim) {
        // Resolvido ANTES da direção, senão o -1 do decrescente traria os
        // vazios para o topo.
        var va = isEmpty(a);
        var vb = isEmpty(b);
        if (va && vb) return 0;
        if (va) return 1;
        if (vb) return -1;
      }

      var cmp = typeof col.compare === 'function'
        ? col.compare(a, b, ra, rb)
        : compareValues(a, b, tipo, col);

      // 0 preserva a ordem de entrada (sort estável) — é o que devolve a
      // tabela à sequência original entre equivalentes.
      return cmp === 0 ? 0 : cmp * dir;
    });
  }

  // ── ESTADO ──────────────────────────────────────────────────────────────────

  function newState() {
    return { key: '', direction: '' };
  }

  // Ciclo: neutro → crescente → decrescente → neutro.
  // Outra coluna sempre recomeça em crescente.
  function nextState(state, key, cols) {
    if (cols && !isSortable(findCol(cols, key))) return state || newState();
    var atual = state || newState();
    if (atual.key !== key) return { key: key, direction: 'asc' };
    if (atual.direction === 'asc') return { key: key, direction: 'desc' };
    return newState();
  }

  function isActive(state, key) {
    return !!state && state.key === key && !!state.direction;
  }

  // ── APRESENTAÇÃO ────────────────────────────────────────────────────────────

  function getAriaSort(state, key) {
    if (!isActive(state, key)) return 'none';
    return state.direction === 'asc' ? 'ascending' : 'descending';
  }

  function getIconClass(state, key) {
    if (!isActive(state, key)) return 'ti-selector';
    return state.direction === 'asc' ? 'ti-chevron-up' : 'ti-chevron-down';
  }

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Descrição textual do estado, para quem usa leitor de tela.
  function stateLabel(state, key) {
    if (!isActive(state, key)) return 'sem ordenação';
    return state.direction === 'asc' ? 'ordenado crescente' : 'ordenado decrescente';
  }

  function nextActionLabel(state, key) {
    if (!isActive(state, key)) return 'ordenar crescente';
    return state.direction === 'asc' ? 'ordenar decrescente' : 'remover ordenação';
  }

  // Monta o <th> completo. O clique fica num <button> real — Tab, Enter e
  // Espaço nativos — nunca no próprio <th>.
  //   col      : { key, label, sortable, ariaLabel }
  //   state    : estado da tabela
  //   onclick  : expressão JS já pronta, ex. "usrSortBy('nome')"
  //   opts     : { disabled, thClass, thAttrs }
  function header(col, state, onclick, opts) {
    opts = opts || {};
    var classes = [];
    if (opts.thClass) classes.push(opts.thClass);
    if (col.thClass)  classes.push(col.thClass);
    // Atributos por coluna preservam estilos que o <th> original já tinha
    // (alinhamento, largura) sem que a tela precise montar o cabeçalho à mão.
    var extra = (opts.thAttrs ? ' ' + opts.thAttrs : '') + (col.thAttrs ? ' ' + col.thAttrs : '');
    var rotulo = col.ariaLabel || col.label;

    if (!isSortable(col)) {
      return '<th' + (classes.length ? ' class="' + classes.join(' ') + '"' : '') + extra + '>'
        + esc(col.label) + '</th>';
    }

    var ativa = isActive(state, col.key);
    if (ativa) classes.push('app-sort-active');

    var estado  = stateLabel(state, col.key);
    var proximo = nextActionLabel(state, col.key);

    return '<th aria-sort="' + getAriaSort(state, col.key) + '"'
      + (classes.length ? ' class="' + classes.join(' ') + '"' : '') + extra + '>'
      + '<button type="button" class="app-sort-btn" data-sort-key="' + esc(col.key) + '"'
      + (opts.disabled ? ' disabled' : '')
      + ' onclick="' + esc(onclick) + '">'
      + '<span>' + esc(col.label) + '</span>'
      + '<i class="ti ' + getIconClass(state, col.key) + ' app-sort-icon" aria-hidden="true"></i>'
      + '<span class="app-sr-only">' + esc(': ' + rotulo + ' ' + estado + '. Ativar para ' + proximo + '.') + '</span>'
      + '</button>'
      + '</th>';
  }

  // Linha inteira de cabeçalho a partir da configuração de colunas.
  // onclickFor recebe a coluna e devolve a expressão do clique.
  function headerRow(cols, state, onclickFor, opts) {
    return cols.map(function(col) {
      return header(col, state, onclickFor(col), opts);
    }).join('');
  }

  window.AppTableSort = {
    collator: collator,
    isEmpty: isEmpty,
    toNumber: toNumber,
    toCurrency: toCurrency,
    toPercent: toPercent,
    toTime: toTime,
    findCol: findCol,
    rawValue: rawValue,
    comparableValue: comparableValue,
    compareValues: compareValues,
    sortRows: sortRows,
    newState: newState,
    nextState: nextState,
    isActive: isActive,
    getAriaSort: getAriaSort,
    getIconClass: getIconClass,
    header: header,
    headerRow: headerRow,
  };
})();
