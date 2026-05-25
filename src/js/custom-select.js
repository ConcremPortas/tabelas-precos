// ── CUSTOM SELECT — dropdown premium com busca integrada ──────────────────────

(function() {
  'use strict';

  // Rastreia todas as instâncias ativas para limpeza de orphans
  var _allInstances = [];

  // ── CLASSE PRINCIPAL ────────────────────────────────────────────────────────
  function CustomSelect(selectEl) {
    if (!(selectEl instanceof HTMLSelectElement)) return;
    this.select          = selectEl;
    this._focusedIdx     = -1;
    this._bound_docClick = this._onDocClick.bind(this);
    this._bound_docKey   = this._onDocKey.bind(this);
    this._bound_scroll   = this._repositionPanel.bind(this);
    this._build();
    this._observe();
    this._bindTrigger();
    this._sync();
    _allInstances.push(this);
  }

  // ── BUILD: cria wrapper, trigger e painel (painel vai no body) ─────────────
  CustomSelect.prototype._build = function() {
    var sel = this.select;

    // Wrapper substitui o select no DOM
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'cs-wrapper';
    sel.parentNode.insertBefore(this.wrapper, sel);
    this.wrapper.appendChild(sel);
    sel.style.display = 'none';

    // Trigger
    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.className = 'cs-trigger';
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.innerHTML =
      '<span class="cs-trigger-text"></span>' +
      '<svg class="cs-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="6 9 12 15 18 9"/>' +
      '</svg>';
    this.wrapper.appendChild(this.trigger);

    // Painel — appended to body para evitar clipping de overflow:hidden
    this.panel = document.createElement('div');
    this.panel.className = 'cs-panel';
    this.panel.style.display = 'none';
    this.panel.tabIndex = -1;
    this.panel._csInst  = this;

    // Campo de busca (visível apenas quando >5 opções)
    this.searchWrap = document.createElement('div');
    this.searchWrap.className = 'cs-search-wrap';
    this.searchWrap.innerHTML =
      '<svg class="cs-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/>' +
        '<path d="M21 21l-4.35-4.35"/></svg>' +
      '<input type="text" class="cs-search-input" placeholder="Buscar..." autocomplete="off">';
    this.searchInput = this.searchWrap.querySelector('input');
    this.panel.appendChild(this.searchWrap);

    // Lista de opções
    this.optList = document.createElement('div');
    this.optList.className = 'cs-opt-list';
    this.optList.setAttribute('role', 'listbox');
    this.panel.appendChild(this.optList);

    document.body.appendChild(this.panel);
  };

  // ── SYNC: atualiza trigger text e estado disabled ───────────────────────────
  CustomSelect.prototype._sync = function() {
    var sel = this.select;
    var idx = sel.selectedIndex;
    var opt = sel.options[idx];
    var textEl = this.trigger.querySelector('.cs-trigger-text');
    if (textEl) textEl.textContent = opt ? opt.textContent.trim() : '';

    var dis = sel.disabled;
    this.trigger.disabled = dis;
    this.trigger.classList.toggle('cs-trigger-disabled', dis);
    this.trigger.setAttribute('aria-expanded', this._isOpen() ? 'true' : 'false');
  };

  // ── RENDER OPTIONS ──────────────────────────────────────────────────────────
  CustomSelect.prototype._renderOptions = function(filter) {
    var self    = this;
    filter      = (filter || '').toLowerCase();
    var opts    = Array.from(this.select.options);
    var curVal  = this.select.value;

    // Mostrar busca apenas quando há mais de 5 opções
    this.searchWrap.style.display = opts.length > 5 ? '' : 'none';

    var filtered = filter
      ? opts.filter(function(o) { return o.textContent.toLowerCase().indexOf(filter) !== -1; })
      : opts;

    this.optList.innerHTML = '';

    if (!filtered.length) {
      var empty = document.createElement('div');
      empty.className = 'cs-empty';
      empty.textContent = 'Nenhuma opção encontrada';
      this.optList.appendChild(empty);
      return;
    }

    filtered.forEach(function(opt) {
      var isDisabled = opt.disabled;
      // Opção placeholder pura (value="" + texto de instrução "Selecione..."): não clicável
      var isPlaceholder = opt.value === '' && /selecione|escolha|primeiro/i.test(opt.textContent);
      var isSelected = opt.value === curVal && !isPlaceholder;

      var item = document.createElement('div');
      item.className = 'cs-option';
      if (isDisabled || isPlaceholder) item.classList.add('cs-disabled');
      if (isSelected) item.classList.add('cs-selected');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      item.dataset.value = opt.value;

      // Preserva classes especiais da opção original (ex: rj-opt-todos)
      if (opt.className) {
        opt.className.split(' ').forEach(function(cls) {
          if (cls) item.classList.add(cls);
        });
      }

      var label = document.createElement('span');
      label.className = 'cs-opt-label';
      label.textContent = opt.textContent.trim();
      item.appendChild(label);

      if (isSelected) {
        var check = document.createElement('span');
        check.className = 'cs-check';
        check.textContent = '✓';
        item.appendChild(check);
      }

      if (!isDisabled && !isPlaceholder) {
        item.addEventListener('mousedown', function(e) {
          e.preventDefault(); // evita blur do searchInput
          self._selectValue(opt.value);
        });
      }

      self.optList.appendChild(item);
    });
  };

  // ── SELECT VALUE: atualiza select nativo e dispara change ──────────────────
  CustomSelect.prototype._selectValue = function(value) {
    this.select.value = value;
    this.select.dispatchEvent(new Event('change', { bubbles: true }));
    this._sync();
    this.closePanel();
  };

  // ── OPEN / CLOSE ────────────────────────────────────────────────────────────
  CustomSelect.prototype._isOpen = function() {
    return this.panel.style.display !== 'none';
  };

  CustomSelect.prototype._repositionPanel = function() {
    if (!this._isOpen()) return;
    var rect = this.trigger.getBoundingClientRect();
    var panelH = Math.min(300, this.panel.scrollHeight + 8);
    var spaceBelow = window.innerHeight - rect.bottom - 4;
    this.panel.style.left  = rect.left + 'px';
    this.panel.style.width = rect.width + 'px';
    if (spaceBelow < panelH && rect.top > spaceBelow) {
      this.panel.style.top    = '';
      this.panel.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
    } else {
      this.panel.style.top    = (rect.bottom + 4) + 'px';
      this.panel.style.bottom = '';
    }
  };

  CustomSelect.prototype.openPanel = function() {
    // Fecha outros painéis abertos
    _allInstances.forEach(function(inst) {
      if (inst.panel.style.display !== 'none') inst.closePanel();
    });

    if (this.searchInput) this.searchInput.value = '';
    this._renderOptions('');
    this._focusedIdx = -1;

    // Posicionar painel via viewport coords (fixed)
    var rect = this.trigger.getBoundingClientRect();
    this.panel.style.width   = rect.width + 'px';
    this.panel.style.left    = rect.left + 'px';
    this.panel.style.display = '';

    // Verifica se cabe abaixo ou deve abrir acima
    var panelH = Math.min(300, this.panel.scrollHeight + 8);
    var spaceBelow = window.innerHeight - rect.bottom - 4;
    if (spaceBelow < panelH && rect.top > spaceBelow) {
      this.panel.style.top    = '';
      this.panel.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
    } else {
      this.panel.style.top    = (rect.bottom + 4) + 'px';
      this.panel.style.bottom = '';
    }

    // Animação de entrada
    this.panel.style.opacity   = '0';
    this.panel.style.transform = 'translateY(-6px)';
    var panel = this.panel;
    requestAnimationFrame(function() {
      panel.style.opacity   = '1';
      panel.style.transform = 'translateY(0)';
    });

    this.trigger.classList.add('cs-trigger-open');
    this.trigger.setAttribute('aria-expanded', 'true');

    // Focar busca ou painel
    var self = this;
    if (this.searchWrap.style.display !== 'none') {
      setTimeout(function() { self.searchInput && self.searchInput.focus(); }, 20);
    } else {
      this.panel.focus();
    }

    document.addEventListener('click', this._bound_docClick, true);
    document.addEventListener('keydown', this._bound_docKey, true);
    // Fechar ao rolar (painel fixed não acompanha o scroll do conteúdo)
    window.addEventListener('scroll', this._bound_scroll, true);
  };

  CustomSelect.prototype.closePanel = function() {
    if (!this._isOpen()) return;
    this.panel.style.display = 'none';
    this.trigger.classList.remove('cs-trigger-open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this._focusedIdx = -1;
    document.removeEventListener('click', this._bound_docClick, true);
    document.removeEventListener('keydown', this._bound_docKey, true);
    window.removeEventListener('scroll', this._bound_scroll, true);
  };

  // ── DOCUMENT EVENT HANDLERS ─────────────────────────────────────────────────
  CustomSelect.prototype._onDocClick = function(e) {
    if (!this.wrapper.contains(e.target) && !this.panel.contains(e.target)) {
      this.closePanel();
    }
  };

  CustomSelect.prototype._onDocKey = function(e) {
    if (e.key === 'Escape') { e.stopPropagation(); this.closePanel(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
      this._handleKey(e);
    }
  };

  // ── KEYBOARD NAVIGATION ─────────────────────────────────────────────────────
  CustomSelect.prototype._handleKey = function(e) {
    var items = Array.from(this.optList.querySelectorAll('.cs-option:not(.cs-disabled)'));
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._focusedIdx = Math.min(this._focusedIdx + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._focusedIdx = Math.max(this._focusedIdx - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this._focusedIdx >= 0 && items[this._focusedIdx]) {
        this._selectValue(items[this._focusedIdx].dataset.value);
      }
      return;
    }

    items.forEach(function(item, i) {
      item.classList.toggle('cs-focused', i === this._focusedIdx);
      if (i === this._focusedIdx) item.scrollIntoView({ block: 'nearest' });
    }, this);
  };

  // ── BIND TRIGGER ────────────────────────────────────────────────────────────
  CustomSelect.prototype._bindTrigger = function() {
    var self = this;

    this.trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      if (self.select.disabled) return;
      if (self._isOpen()) self.closePanel();
      else self.openPanel();
    });

    this.trigger.addEventListener('keydown', function(e) {
      if ((e.key === 'ArrowDown' || e.key === ' ') && !self._isOpen()) {
        e.preventDefault();
        self.openPanel();
      }
    });

    if (this.searchInput) {
      this.searchInput.addEventListener('input', function() {
        self._renderOptions(self.searchInput.value);
        self._focusedIdx = -1;
      });
      this.searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
          self._handleKey(e);
        } else if (e.key === 'Escape') {
          e.stopPropagation();
          self.closePanel();
        }
      });
    }
  };

  // ── MUTATIONOBSERVER: reage a mudanças no select (options, disabled, value) ─
  CustomSelect.prototype._observe = function() {
    var self = this;
    var observer = new MutationObserver(function(mutations) {
      var optChanged = mutations.some(function(m) { return m.type === 'childList'; });
      self._sync();
      // Atualiza painel se estiver aberto e as opções mudaram
      if (optChanged && self._isOpen()) {
        self._renderOptions(self.searchInput ? self.searchInput.value : '');
      }
    });
    observer.observe(this.select, {
      childList: true,
      attributes: true,
      attributeFilter: ['disabled', 'value'],
      subtree: false,
    });

    // Intercept .value = x (propriedade IDL — não dispara MutationObserver)
    var proto = HTMLSelectElement.prototype;
    var desc  = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.configurable) {
      Object.defineProperty(this.select, 'value', {
        get: function() { return desc.get.call(this); },
        set: function(val) {
          desc.set.call(this, val);
          self._sync();
        },
        configurable: true,
      });
    }
  };

  // ── DESTROY ──────────────────────────────────────────────────────────────────
  CustomSelect.prototype.destroy = function() {
    this.closePanel();
    this.panel.remove();
    this.select.style.display = '';
    if (this.wrapper.parentNode) {
      this.wrapper.parentNode.insertBefore(this.select, this.wrapper);
      this.wrapper.remove();
    }
    _allInstances = _allInstances.filter(function(i) { return i !== this; }, this);
  };

  function initCustomSelects() {
    // Remove instâncias orphaned (select não está mais no DOM)
    _allInstances = _allInstances.filter(function(inst) {
      if (document.body.contains(inst.select)) return true;
      inst.panel.remove();
      return false;
    });

    // Captura TODOS os selects do app que ainda não foram inicializados
    document.querySelectorAll('select').forEach(function(el) {
      if (el.dataset.customSelect) return; // já inicializado
      el.dataset.customSelect = 'true';
      new CustomSelect(el);
    });
  }

  // Expõe globalmente
  window.CustomSelect      = CustomSelect;
  window.initCustomSelects = initCustomSelects;

  // ── HOOK onAfterRender ───────────────────────────────────────────────────────
  (function() {
    var _prev = typeof window.onAfterRender === 'function' ? window.onAfterRender : null;
    window.onAfterRender = function(section) {
      if (_prev) {
        try { _prev(section); } catch(e) { console.error('[custom-select] erro em hook anterior:', e); }
      }
      initCustomSelects();
    };
  })();

  // ── MUTATIONOBSERVER GLOBAL: captura <select> adicionados dinamicamente ──────
  // Dispara imediatamente (sem timeout) para evitar flash do select nativo.
  // Só observa selects que ainda não foram inicializados (sem data-custom-select).
  var _csRunning = false;
  var _csBodyObserver = new MutationObserver(function(mutations) {
    if (_csRunning) return; // evita re-entrada durante initCustomSelects
    var hasNew = false;
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        var node = added[j];
        if (node.nodeType !== 1) continue;
        // Verifica se o nó é (ou contém) um select ainda não inicializado
        if (node.tagName === 'SELECT' && !node.dataset.customSelect) {
          hasNew = true; break;
        }
        if (node.querySelector && node.querySelector('select:not([data-custom-select])')) {
          hasNew = true; break;
        }
      }
      if (hasNew) break;
    }
    if (hasNew) {
      _csRunning = true;
      initCustomSelects();
      _csRunning = false;
    }
  });
  _csBodyObserver.observe(document.body, { childList: true, subtree: true });

  // Inicializa na carga inicial
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomSelects);
  } else {
    initCustomSelects();
  }

})();
