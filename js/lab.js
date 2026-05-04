// ---- Papers page v2 ----
(function ($) {

  // ---- state ----
  var pv2Query = '';
  var pv2Theme = null;

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
        var themeMatch  = !pv2Theme || themes.indexOf(pv2Theme) > -1;
        var searchMatch = !tokens.length || tokens.every(function (tok) { return blob.indexOf(tok) > -1; });
        var visible = themeMatch && searchMatch;
        $row.toggle(visible);
        if (visible) { yearVisible = true; visibleCount++; }
      });

      $yearRow.toggle(yearVisible);
    });

    if (pv2Query || pv2Theme) {
      $count.text(visibleCount + (visibleCount === 1 ? ' result' : ' results')).show();
    } else {
      $count.hide();
    }

    $chips.find('.pv2-chip').each(function () {
      $(this).toggleClass('on', $(this).attr('data-theme') === (pv2Theme || ''));
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
    pv2Theme = (tid === '' || tid === pv2Theme) ? null : tid;
    pv2Render();
  });

  // ---- fix body.loading after AJAX nav ----
  // journal.js appends new .page__content to .page after its 400ms swap.
  // body.loading .page { visibility:hidden } blocks all pointer events until
  // body.loading is removed. Watch .page for the append and clear it.
  var _page = document.querySelector('.page');
  if (_page) {
    new MutationObserver(function () {
      pv2Query = '';
      pv2Theme = '';
      // give journal.js a moment to finish, then clear loading
      setTimeout(function () {
        $('body').removeClass('loading');
      }, 50);
    }).observe(_page, { childList: true });
  }

}(jQuery));
