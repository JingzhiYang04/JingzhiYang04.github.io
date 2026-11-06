(() => {
  const contents = document.querySelector('[data-case-contents]');
  if (!contents) return;
  const compact = window.matchMedia('(max-width: 1100px)');
  const links = [...contents.querySelectorAll('a')];
  const sections = links.map(link => document.querySelector(link.hash));
  let queued = false;

  function updateCurrent() {
    const readingLine = Math.min(window.innerHeight * .28, 220);
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= readingLine) current = section;
    }
    if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    for (const link of links) {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    queued = false;
  }
  function scheduleUpdate() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(updateCurrent);
  }
  function configureContents() {
    contents.open = !compact.matches;
    scheduleUpdate();
  }
  for (const link of links) {
    link.addEventListener('click', () => {
      if (compact.matches) contents.open = false;
      scheduleUpdate();
    });
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  compact.addEventListener('change', configureContents);
  configureContents();
})();
