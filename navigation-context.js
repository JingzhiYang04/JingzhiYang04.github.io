(() => {
  function openExperience() {
    const entry = document.getElementById(window.location.hash.slice(1));
    if (!entry?.matches('.timeline-item')) return;
    entry.open = true;
    window.requestAnimationFrame(() => entry.scrollIntoView({ block: 'start' }));
  }

  if (document.querySelector('.about-page')) {
    openExperience();
    window.addEventListener('hashchange', openExperience);
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('from') !== 'about') return;

  const entries = new Set(['amplify', 'storyblocks', 'apsolway', 'collegebot', 'dentsu']);
  const entry = params.get('entry');
  const target = new URL('../about.html', window.location.href);
  if (entries.has(entry)) target.hash = `experience-${entry}`;

  for (const link of document.querySelectorAll('.case-intro .back, .case-next > a:first-child')) {
    link.href = target.href;
    link.textContent = '← About';
  }

  const next = document.querySelector('.case-next > a:last-child');
  if (!next) return;
  const nextUrl = new URL(next.href);
  if (nextUrl.origin !== window.location.origin) return;
  nextUrl.searchParams.set('from', 'about');
  if (entries.has(entry)) nextUrl.searchParams.set('entry', entry);
  next.href = nextUrl.href;
})();
