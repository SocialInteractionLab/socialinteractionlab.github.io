// photo album on people page
// uses event delegation so it survives AJAX page loads
document.addEventListener('click', function (e) {
  var thumb = e.target.closest('.photo-thumb');
  if (!thumb) return;

  var year = thumb.dataset.year;
  if (!year) return;

  document.querySelectorAll('.photo-main img').forEach(function (img) {
    img.classList.remove('visible');
  });
  var target = document.getElementById('photo-' + year);
  if (target) target.classList.add('visible');

  document.querySelectorAll('.photo-thumb').forEach(function (t) {
    t.classList.remove('active');
  });
  thumb.classList.add('active');
});
