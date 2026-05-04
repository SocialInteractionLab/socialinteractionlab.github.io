// ensure body.loading is removed after AJAX nav
// journal.js removes it via imagesLoaded on .header-image, which can stall
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
