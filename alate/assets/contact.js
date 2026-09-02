// Contact sheet: every [data-contact] control opens the <dialog id="contact">
// instead of firing a mailto: — a mailto: link stalls anyone whose laptop
// has no default mail client configured. The dialog shows the address,
// copies it on request, and keeps the mailto: as an opt-in secondary link.
(function () {
  var dialog = document.getElementById('contact');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  document.querySelectorAll('[data-contact]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      dialog.showModal();
    });
  });

  dialog.addEventListener('click', function (e) {
    // Click on the backdrop (outside the form) closes.
    if (e.target === dialog) dialog.close();
  });

  var copy = dialog.querySelector('[data-copy]');
  var addr = dialog.querySelector('[data-address]');
  if (copy && addr) {
    var label = copy.textContent;
    copy.addEventListener('click', function () {
      var text = addr.textContent.trim();
      var done = function () {
        copy.textContent = 'Copied';
        setTimeout(function () { copy.textContent = label; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
      } else {
        fallback(text); done();
      }
    });
  }

  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) { /* nothing else to try */ }
    document.body.removeChild(ta);
  }
})();
