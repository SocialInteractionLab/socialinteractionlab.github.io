// ensure body.loading is removed after AJAX nav
if (window.History && window.History.Adapter) {
  window.History.Adapter.bind(window, 'statechange', function () {
    setTimeout(function () {
      document.body.classList.remove('loading');
    }, 600);
  });
}

// header-image and header-overlay are decorative — never capture clicks
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.header-image, .header-overlay').forEach(function (el) {
    el.style.pointerEvents = 'none';
  });
});

// ---- Papers page v2 ----
// Runs on direct load and after AJAX navigation (via ajaxComplete).
// Data lives in <textarea hidden> elements in the page so jQuery doesn't
// strip them during .load() injection (unlike <script> tags).

function initPapersPage() {
  var papersEl = document.getElementById('pv2-papers-data');
  var themesEl = document.getElementById('pv2-themes-data');
  var listEl   = document.getElementById('pv2-list');
  var chipsEl  = document.getElementById('pv2-chips');
  var searchInput = document.getElementById('pv2-search-input');
  var countEl  = document.getElementById('pv2-count');

  if (!papersEl || !themesEl || !listEl) return;
  if (listEl.getAttribute('data-pv2-init')) return;
  listEl.setAttribute('data-pv2-init', '1');

  var papers = JSON.parse(papersEl.value);
  var themes = JSON.parse(themesEl.value);

  var currentQuery = '';
  var currentTheme = null;

  // pre-compute per-theme counts
  themes.forEach(function (t) {
    t.count = papers.filter(function (p) {
      return p.themes && p.themes.indexOf(t.id) > -1;
    }).length;
  });

  // ---- helpers ----
  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, tokens) {
    var out = esc(text);
    if (!tokens.length) return out;
    tokens.forEach(function (tok) {
      out = out.replace(new RegExp('(' + escRe(esc(tok)) + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }

  // ---- chips ----
  function renderChips() {
    var all = papers.length;
    var html = '<span class="pv2-chip' + (currentTheme === null ? ' on' : '') + '" data-theme="">All <span class="pv2-chip-c">' + all + '</span></span>';
    themes.forEach(function (t) {
      if (!t.count) return;
      html += '<span class="pv2-chip' + (currentTheme === t.id ? ' on' : '') + '" data-theme="' + esc(t.id) + '">'
           + esc(t.label) + ' <span class="pv2-chip-c">' + t.count + '</span></span>';
    });
    chipsEl.innerHTML = html;
    Array.prototype.forEach.call(chipsEl.querySelectorAll('.pv2-chip'), function (chip) {
      chip.addEventListener('click', function () {
        var tid = this.getAttribute('data-theme');
        currentTheme = (tid === '' || tid === currentTheme) ? null : tid;
        render();
      });
    });
  }

  // ---- main render ----
  function render() {
    var tokens = currentQuery.toLowerCase().split(/\s+/).filter(Boolean);

    var filtered = papers.filter(function (p) {
      if (currentTheme && (!p.themes || p.themes.indexOf(currentTheme) === -1)) return false;
      if (!tokens.length) return true;
      var themeLabels = (p.themes || []).map(function (tid) {
        var t = themes.filter(function (x) { return x.id === tid; })[0];
        return t ? t.label : '';
      }).join(' ');
      var blob = ((p.title || '') + ' ' + (p.authors || '') + ' ' + (p.journal || '') + ' ' + themeLabels).toLowerCase();
      return tokens.every(function (tok) { return blob.indexOf(tok) > -1; });
    });

    // count display
    if (currentQuery) {
      countEl.textContent = filtered.length + (filtered.length === 1 ? ' result' : ' results');
      countEl.style.display = '';
    } else {
      countEl.style.display = 'none';
    }

    if (filtered.length === 0) {
      var msg = 'No papers match';
      if (currentQuery) msg += ' \u201c' + esc(currentQuery) + '\u201d';
      if (currentTheme) msg += ' in this theme';
      msg += '.';
      listEl.innerHTML = '<div class="pv2-empty">' + msg + '</div>';
      renderChips();
      return;
    }

    // group by year descending
    var byYear = {};
    filtered.forEach(function (p) {
      var yr = p.year || 'Other';
      (byYear[yr] = byYear[yr] || []).push(p);
    });
    var years = Object.keys(byYear).sort(function (a, b) { return b - a; });

    var html = '';
    years.forEach(function (yr) {
      html += '<div class="pv2-year-row"><div class="pv2-yr">' + esc(yr) + '</div><div class="pv2-papers">';
      byYear[yr].forEach(function (p) {
        var hasImage = p.image && p.image !== '';
        var thumb = hasImage
          ? '<div class="pv2-thumb" style="background-image:url(\'' + esc(p.image) + '\')"></div>'
          : '';

        var titleHtml = highlight(p.title || '', tokens);
        var titleEl = p.url
          ? '<a class="pv2-ptitle" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + titleHtml + '</a>'
          : '<div class="pv2-ptitle">' + titleHtml + '</div>';

        var authorHtml = highlight(p.authors || '', tokens);
        var venueHtml  = highlight(p.journal  || '', tokens);

        var themeChips = '';
        (p.themes || []).forEach(function (tid) {
          var t = themes.filter(function (x) { return x.id === tid; })[0];
          if (t) themeChips += '<span class="pv2-pth">' + esc(t.label) + '</span>';
        });

        var links = '';
        if (p.materials) links += '<a class="pv2-link" href="' + esc(p.materials) + '" target="_blank" rel="noopener">materials</a>';
        if (p.talk)      links += '<a class="pv2-link" href="' + esc(p.talk)      + '" target="_blank" rel="noopener">talk</a>';
        if (p.dataset)   links += '<a class="pv2-link" href="' + esc(p.dataset)   + '" target="_blank" rel="noopener">dataset</a>';
        if (p.demo)      links += '<a class="pv2-link" href="' + esc(p.demo)      + '" target="_blank" rel="noopener">demo</a>';

        html += '<div class="pv2-paper-row' + (hasImage ? '' : ' pv2-no-image') + '">';
        html += thumb;
        html += '<div class="pv2-paper-body">';
        html += titleEl;
        html += '<div class="pv2-pauth">' + authorHtml + '</div>';
        if (themeChips) html += '<div class="pv2-pthemes">' + themeChips + '</div>';
        if (links) html += '<div class="pv2-links">' + links + '</div>';
        html += '</div>';
        html += '<div class="pv2-pvenue">' + venueHtml + '</div>';
        html += '</div>';
      });
      html += '</div></div>';
    });

    listEl.innerHTML = html;
    renderChips();
  }

  searchInput.addEventListener('input', function () {
    currentQuery = this.value;
    render();
  });

  render();
}

// Direct page load (lab.js runs at end of <body>, DOM is ready)
initPapersPage();

// After AJAX navigation — journal.js uses jQuery .load(), so ajaxComplete
// fires when the new page content has been injected into the DOM.
if (typeof jQuery !== 'undefined') {
  jQuery(document).ajaxComplete(function () {
    initPapersPage();
  });
}
