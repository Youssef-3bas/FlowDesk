export function initCurrentYear() {
  const yearElements = document.querySelectorAll("[data-current-year]");
  const currentYear = String(new Date().getFullYear());

  for (const element of yearElements) {
    element.textContent = currentYear;
  }
}
