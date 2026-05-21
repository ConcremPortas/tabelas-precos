// ── MICRO-INTERACTIONS ────────────────────────────────────────────────────────
// Only visual/animation concerns. No data, no logic, no structural changes.

(function() {

  // ── 1. SECTION TRANSITIONS ─────────────────────────────────────────────────
  var _miOrig  = window.render;
  var _miTimer = null;

  window.render = function() {
    var content = document.getElementById('content');
    if (!content || !content.innerHTML.trim()) {
      _miOrig();
      return;
    }
    // Cancel any in-flight fade so rapid clicks never pile up
    if (_miTimer) {
      clearTimeout(_miTimer);
      _miTimer = null;
      content.classList.remove('mi-fade-out', 'mi-fade-in');
    }
    content.classList.add('mi-fade-out');
    _miTimer = setTimeout(function() {
      _miTimer = null;
      content.classList.remove('mi-fade-out');
      _miOrig();
      void content.offsetWidth;
      content.classList.add('mi-fade-in');
      content.addEventListener('animationend', function h() {
        content.classList.remove('mi-fade-in');
        content.removeEventListener('animationend', h);
      });
    }, 140);
  };

  // ── 2. CHANNEL SWITCH: FLAG FOR PRICE FLASH ────────────────────────────────
  var _miChannelChanged = false;
  var _miOrigSetChannel = window.setChannel;
  window.setChannel = function(btn) {
    _miChannelChanged = true;
    _miOrigSetChannel(btn);
  };

  // ── 3. AFTER-RENDER HOOK ───────────────────────────────────────────────────
  // Encadeia sobre o onAfterRender já definido pelos scripts anteriores
  // (auth.js / gerenciar-tabelas.js podem ter definido o seu próprio hook).
  var _miPrevAfterRender = typeof onAfterRender === 'function' ? onAfterRender : null;
  window.onAfterRender = function(section) {

    // Chama hooks anteriores da cadeia primeiro
    if (_miPrevAfterRender) {
      try { _miPrevAfterRender(section); } catch(e) { console.error('[microinteractions] erro em hook anterior:', e); }
    }

    // Price flash on channel change
    if (_miChannelChanged) {
      _miChannelChanged = false;
      document.querySelectorAll(
        'td.price, td.td-price, td.protect-price, td.price-regua, td.price-ml'
      ).forEach(function(td) {
        td.classList.remove('mi-price-flash');
        void td.offsetWidth;
        td.classList.add('mi-price-flash');
        td.addEventListener('animationend', function() {
          td.classList.remove('mi-price-flash');
        }, { once: true });
      });
    }

    // Metric card stagger entrance
    document.querySelectorAll('.hr-card').forEach(function(card, i) {
      card.style.animationDelay = (i * 80) + 'ms';
      card.classList.remove('mi-card-animate');
      void card.offsetWidth;
      card.classList.add('mi-card-animate');
      card.addEventListener('animationend', function() {
        card.style.animationDelay = '';
      }, { once: true });
    });

    // Animated number counter for metric values
    document.querySelectorAll('.hr-card-val').forEach(function(el) {
      var raw = el.textContent.trim();
      // Only animate simple integers (not percentages, not symbols like —)
      if (/^\d+$/.test(raw)) {
        var target = parseInt(raw, 10);
        _miCountUp(el, target);
      }
    });

    // .rj-badge pulsing dot is handled purely via CSS ::before (no JS needed)
  };

  // ── 4. COUNTER ANIMATION ──────────────────────────────────────────────────
  function _miCountUp(el, target) {
    var start = performance.now();
    var duration = 600;
    function tick(now) {
      var elapsed = now - start;
      var t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── 5. BUTTON SPRING ON CLICK ─────────────────────────────────────────────
  document.addEventListener('mousedown', function(e) {
    var btn = e.target.closest(
      '.rj-apply-btn, .gm-btn-concluir, .login-btn, .hr-export-btn, .gm-modal-btn-confirm'
    );
    if (!btn || btn.disabled) return;
    btn.classList.remove('mi-btn-click');
    void btn.offsetWidth;
    btn.classList.add('mi-btn-click');
    btn.addEventListener('animationend', function() {
      btn.classList.remove('mi-btn-click');
    }, { once: true });
  });

  // ── 6. PRINT BUTTON ICON SHAKE ────────────────────────────────────────────
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.print-btn');
    if (!btn) return;
    var svg = btn.querySelector('svg');
    if (!svg) return;
    svg.classList.remove('mi-print-shake');
    void svg.offsetWidth;
    svg.classList.add('mi-print-shake');
    svg.addEventListener('animationend', function() {
      svg.classList.remove('mi-print-shake');
    }, { once: true });
  });

  // ── 7. SIDEBAR NAV ITEM CLICK FEEDBACK ────────────────────────────────────
  document.addEventListener('mousedown', function(e) {
    var item = e.target.closest('.nav-item');
    if (!item) return;
    item.style.transition = 'transform 0.1s ease';
    item.style.transform  = 'scale(0.97)';
    setTimeout(function() {
      item.style.transform  = '';
    }, 100);
  });

  // ── 8. SEARCH MATCH HIGHLIGHT ─────────────────────────────────────────────
  var _miOrigApplySearch = window.applySearch;
  window.applySearch = function() {
    _miOrigApplySearch();
    var term = (typeof searchTerm !== 'undefined' ? searchTerm : '').trim();
    if (!term) return;
    document.querySelectorAll('tbody tr').forEach(function(row) {
      if (row.style.display !== 'none') {
        row.classList.remove('mi-search-match');
        void row.offsetWidth;
        row.classList.add('mi-search-match');
        row.addEventListener('animationend', function() {
          row.classList.remove('mi-search-match');
        }, { once: true });
      }
    });
  };

  // ── 9. REMOVED ROW: ANIMATE STRIKETHROUGH ─────────────────────────────────
  // Intercept gmToggleRemove by observing DOM class changes
  var _miOrigToggleRemove = window.gmToggleRemove;
  if (typeof _miOrigToggleRemove === 'function') {
    window.gmToggleRemove = function(btn) {
      _miOrigToggleRemove(btn);
      var row = btn.closest('tr');
      if (!row) return;
      if (row.classList.contains('gm-removed')) {
        // Adding removed: trigger strikethrough animation
        void row.offsetWidth;
        row.classList.add('mi-removing');
      } else {
        row.classList.remove('mi-removing');
      }
    };
  }

  // ── 10. MODAL OPEN ANIMATION ──────────────────────────────────────────────
  // Use MutationObserver to detect when the confirm modal is inserted into DOM
  var _miModalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        if (node.classList && node.classList.contains('gm-modal-overlay')) {
          void node.offsetWidth;
          node.classList.add('mi-modal-open');
        }
      });
    });
  });
  _miModalObserver.observe(document.body, { childList: true });

})();
