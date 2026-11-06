const toc = document.querySelector('.cb-toc');
const compactToc = window.matchMedia('(max-width: 1100px)');
const tocLinks = [...toc.querySelectorAll('a')];
function configureContents() {
  toc.open = !compactToc.matches;
}
configureContents();
compactToc.addEventListener('change', configureContents);
for (const link of tocLinks) {
  link.addEventListener('click', () => {
    if (compactToc.matches) toc.open = false;
  });
}
const sections = tocLinks.map(link => document.querySelector(link.getAttribute('href')));
const visibleSections = new Set();
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) visibleSections.add(entry.target);
    else visibleSections.delete(entry.target);
  }
  const current = sections.find(section => visibleSections.has(section));
  if (!current) return;
  for (const link of tocLinks) {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}, { rootMargin: '-5% 0px -55% 0px' });
for (const section of sections) sectionObserver.observe(section);

const stories = document.querySelector('.cb-stories');
const storyNav = stories.querySelector('.cb-story-nav');
const storyButtons = [...storyNav.querySelectorAll('button')];
const storyPanels = [...stories.querySelectorAll('.cb-story')];
const desktopStories = window.matchMedia('(min-width: 801px)');
let selectedStory = 0;
function selectStory(index) {
  selectedStory = index;
  for (let i = 0; i < storyButtons.length; i += 1) {
    storyButtons[i].setAttribute('aria-selected', String(i === index));
    storyButtons[i].tabIndex = i === index ? 0 : -1;
    storyPanels[i].hidden = desktopStories.matches && i !== index;
  }
}
function configureStories() {
  storyNav.hidden = !desktopStories.matches;
  stories.classList.toggle('is-tabbed', desktopStories.matches);
  for (let i = 0; i < storyPanels.length; i += 1) {
    const panel = storyPanels[i];
    panel.open = desktopStories.matches || i === selectedStory;
    if (desktopStories.matches) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', storyButtons[i].id);
    } else {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-labelledby');
    }
  }
  selectStory(selectedStory);
}
for (let index = 0; index < storyButtons.length; index += 1) {
  storyButtons[index].addEventListener('click', () => selectStory(index));
  storyButtons[index].addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowDown') next = (index + 1) % storyButtons.length;
    else if (event.key === 'ArrowUp') next = (index + storyButtons.length - 1) % storyButtons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = storyButtons.length - 1;
    else return;
    event.preventDefault();
    selectStory(next);
    storyButtons[next].focus();
  });
}
configureStories();
desktopStories.addEventListener('change', configureStories);

const viewer = document.querySelector('.cb-lightbox');
const viewerImage = viewer.querySelector('img');
const imageTitle = viewer.querySelector('#cb-image-title');
const zoomButton = viewer.querySelector('[data-image-zoom]');
let imageOpener;
for (const link of document.querySelectorAll('a[data-image]')) {
  link.addEventListener('click', event => {
    event.preventDefault();
    imageOpener = link;
    viewerImage.src = link.href;
    viewerImage.alt = link.querySelector('img').alt;
    imageTitle.textContent = viewerImage.alt;
    viewer.classList.remove('is-zoomed');
    zoomButton.textContent = 'Actual size';
    zoomButton.setAttribute('aria-pressed', 'false');
    viewer.showModal();
  });
}
zoomButton.addEventListener('click', () => {
  const zoomed = viewer.classList.toggle('is-zoomed');
  zoomButton.textContent = zoomed ? 'Fit image' : 'Actual size';
  zoomButton.setAttribute('aria-pressed', String(zoomed));
});
viewer.querySelector('[data-image-close]').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => imageOpener?.focus());
