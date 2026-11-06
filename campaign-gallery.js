(() => {
  for (const gallery of document.querySelectorAll('[data-gallery]')) {
    const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
    const dots = [...gallery.querySelectorAll('[data-gallery-dot]')];
    const viewport = gallery.querySelector('[data-gallery-viewport]');
    const counter = gallery.querySelector('[data-gallery-count]');
    const controls = gallery.querySelector('[data-gallery-controls]');
    let current = 0;
    let start = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      for (const [i, slide] of slides.entries()) slide.hidden = i !== current;
      for (const [i, dot] of dots.entries()) dot.setAttribute('aria-pressed', String(i === current));
      counter.textContent = `${current + 1} / ${slides.length}`;
    }

    gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show(current - 1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1));
    for (const [i, dot] of dots.entries()) dot.addEventListener('click', () => show(i));
    gallery.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === 'ArrowLeft') show(current - 1);
      else if (event.key === 'ArrowRight') show(current + 1);
      else if (event.key === 'Home') show(0);
      else if (event.key === 'End') show(slides.length - 1);
      else return;
      event.preventDefault();
    });
    viewport.addEventListener('touchstart', event => {
      start = event.touches.length === 1 ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : null;
    }, {passive: true});
    viewport.addEventListener('touchend', event => {
      if (!start || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
      start = null;
    }, {passive: true});
    viewport.addEventListener('touchcancel', () => { start = null; }, {passive: true});
    gallery.classList.add('is-enhanced');
    controls.hidden = false;
    show(0);
  }
})();
