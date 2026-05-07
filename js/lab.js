// ---- Papers page v2 ----
(function ($) {

  // ---- state ----
  var pv2Query  = '';
  var pv2Themes = [];  // multi-select: array of active theme ids

  // header overlays are decorative
  $('.header-image, .header-overlay').css('pointer-events', 'none');

  // ---- render ----
  function pv2Render() {
    var $list  = $('#pv2-list');
    var $chips = $('#pv2-chips');
    var $count = $('#pv2-count');
    if (!$list.length || !$chips.length || !$count.length) return;
    var tokens = pv2Query.toLowerCase().split(/\s+/).filter(Boolean);
    var visibleCount = 0;

    $list.find('.pv2-year-row').each(function () {
      var $yearRow = $(this);
      var yearVisible = false;

      $yearRow.find('.pv2-paper-row').each(function () {
        var $row    = $(this);
        var themes  = ($row.attr('data-themes') || '').split(/\s+/);
        var blob    = $row.attr('data-search-blob') || '';
        // AND logic: every selected theme must be present on the paper
        var themeMatch  = !pv2Themes.length || pv2Themes.every(function (t) { return themes.indexOf(t) > -1; });
        var searchMatch = !tokens.length || tokens.every(function (tok) { return blob.indexOf(tok) > -1; });
        var visible = themeMatch && searchMatch;
        $row.toggle(visible);
        if (visible) { yearVisible = true; visibleCount++; }
      });

      $yearRow.toggle(yearVisible);
    });

    if (pv2Query || pv2Themes.length) {
      $count.text(visibleCount + (visibleCount === 1 ? ' result' : ' results')).show();
    } else {
      $count.hide();
    }

    // update chip highlight states
    $chips.find('.pv2-chip').each(function () {
      var tid = $(this).attr('data-theme');
      if (tid === '') {
        $(this).toggleClass('on', pv2Themes.length === 0);
      } else {
        $(this).toggleClass('on', pv2Themes.indexOf(tid) > -1);
      }
    });
  }

  // ---- delegated events ----
  $(document).on('input', function (e) {
    if ($(e.target).is('#pv2-search-input')) {
      pv2Query = e.target.value;
      pv2Render();
    }
  });

  $(document).on('click', function (e) {
    var $chip = $(e.target).closest('.pv2-chip');
    if (!$chip.length || $chip.attr('data-theme') === undefined) return;
    var tid = $chip.attr('data-theme');
    if (tid === '') {
      pv2Themes = [];
    } else {
      var idx = pv2Themes.indexOf(tid);
      if (idx > -1) {
        pv2Themes.splice(idx, 1);
      } else {
        pv2Themes.push(tid);
      }
    }
    pv2Render();
  });

  // ---- fix body.loading after AJAX nav ----
  var _page = document.querySelector('.page');
  if (_page) {
    new MutationObserver(function () {
      pv2Query  = '';
      pv2Themes = [];
      setTimeout(function () {
        $('body').removeClass('loading');
      }, 50);
    }).observe(_page, { childList: true });
  }

}(jQuery));
