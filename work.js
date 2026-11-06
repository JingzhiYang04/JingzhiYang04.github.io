const bar = document.querySelector(".filter-bar");
const filters = [...bar.querySelectorAll("button")];
const cards = [...document.querySelectorAll(".work-card")];
const count = document.querySelector("#work-count");

function applyFilter(category) {
  let visible = 0;
  for (const filter of filters) {
    filter.setAttribute("aria-pressed", String(filter.dataset.filter === category));
  }
  for (const card of cards) {
    card.hidden = category !== "all" && !card.dataset.categories.split("|").includes(category);
    if (!card.hidden) visible += 1;
  }
  count.textContent = visible === 1 ? "1 project" : `${visible} projects`;
}

const url = new URL(window.location.href);
const requestedCategory = url.searchParams.get("category");
const selectedCategory = filters.some((button) => button.dataset.filter === requestedCategory)
  ? requestedCategory
  : "all";

applyFilter(selectedCategory);
bar.hidden = false;

for (const button of filters) {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    applyFilter(category);
    if (category === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    window.history.replaceState(null, "", url);
  });
}
