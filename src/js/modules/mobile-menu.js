const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

export function initMobileMenu() {
  const toggleButton = document.querySelector("[data-menu-toggle]");
  const menuPanel = document.querySelector("[data-menu]");

  if (!toggleButton || !menuPanel) {
    return;
  }

  const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

  const syncAriaHidden = (isOpen) => {
    if (desktopQuery.matches) {
      menuPanel.removeAttribute("aria-hidden");
    } else {
      menuPanel.setAttribute("aria-hidden", String(!isOpen));
    }
  };

  const setMenuOpen = (isOpen) => {
    if (isOpen) {
      menuPanel.setAttribute("data-open", "");
      document.body.classList.add("overflow-hidden");
    } else {
      menuPanel.removeAttribute("data-open");
      document.body.classList.remove("overflow-hidden");
    }

    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute(
      "aria-label",
      isOpen ? "Close main menu" : "Open main menu",
    );
    syncAriaHidden(isOpen);
  };

  syncAriaHidden(false);

  toggleButton.addEventListener("click", () => {
    const isCurrentlyOpen = menuPanel.hasAttribute("data-open");
    setMenuOpen(!isCurrentlyOpen);
  });

  menuPanel.addEventListener("click", (event) => {
    const clickedLink =
      event.target instanceof Element ? event.target.closest("a") : null;
    if (clickedLink && menuPanel.hasAttribute("data-open")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuPanel.hasAttribute("data-open")) {
      setMenuOpen(false);
      toggleButton.focus();
    }
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && menuPanel.hasAttribute("data-open")) {
      setMenuOpen(false);
    } else {
      syncAriaHidden(menuPanel.hasAttribute("data-open"));
    }
  });
}
