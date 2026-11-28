/* Backup Loop: mobile nav + park directory filter. No dependencies. */
(function () {
  document.documentElement.classList.add('js');
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (btn && nav) {
      btn.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    var q = document.getElementById('park-search');
    var prov = document.getElementById('park-province');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-park]'));
    if (!q || !prov || !cards.length) return;
    var status = document.getElementById('filter-status');
    var empty = document.getElementById('no-results');
    var params = new URLSearchParams(location.search);
    if (params.get('q')) q.value = params.get('q');
    if (params.get('prov')) prov.value = params.get('prov');
    function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    function apply() {
      var term = norm(q.value.trim());
      var p = prov.value;
      var shown = 0;
      cards.forEach(function (c) {
        var okP = !p || (' ' + c.getAttribute('data-prov') + ' ').indexOf(' ' + p + ' ') !== -1;
        var okT = !term || norm(c.getAttribute('data-search') + ' ' + c.textContent).indexOf(term) !== -1;
        var ok = okP && okT;
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (status) status.textContent = shown + (shown === 1 ? ' park shown' : ' parks shown');
      if (empty) empty.classList.toggle('show', shown === 0);
    }
    q.addEventListener('input', apply);
    prov.addEventListener('change', apply);
    apply();
  });
})();
