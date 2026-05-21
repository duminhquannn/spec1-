const soundButton = document.querySelector(".sound-button");
const helpButton = document.querySelector(".header-actions .icon-button:not(.sound-button):not(.menu-button)");
const menuButton = document.querySelector(".menu-button");
const pageMenu = document.querySelector(".page-menu");
const pageMenuItems = document.querySelectorAll(".page-menu__item");
const currentPageLabel = document.querySelector(".current-page-label");
const instructionPanel = document.querySelector(".instruction-panel");
const previousPageButton = document.querySelector(".nav-arrow:first-of-type");
const nextPageButton = document.querySelector(".nav-arrow:last-of-type");
const siteLogo = document.querySelector(".site-logo");
const pageNames = Array.from(pageMenuItems).map((item) => item.dataset.page || item.textContent.trim());
let currentPageIndex = Math.max(0, pageNames.indexOf(currentPageLabel?.textContent.trim() || "Home"));

if (soundButton) {
  soundButton.addEventListener("click", () => {
    const isActive = soundButton.classList.toggle("is-active");

    soundButton.setAttribute("aria-pressed", String(isActive));
    soundButton.setAttribute("aria-label", isActive ? "Sound on" : "Sound off");
  });
}

if (helpButton) {
  helpButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = !instructionPanel?.classList.contains("is-open");

    helpButton.classList.toggle("is-active", isOpen);
    instructionPanel?.classList.toggle("is-open", isOpen);
    instructionPanel?.setAttribute("aria-hidden", String(!isOpen));
    setMenuOpen(false);
  });
}

function setMenuOpen(isOpen) {
  if (!menuButton || !pageMenu) return;

  menuButton.classList.toggle("is-active", isOpen);
  pageMenu.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

if (menuButton && pageMenu) {
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(!pageMenu.classList.contains("is-open"));
  });

  pageMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    setMenuOpen(false);
    helpButton?.classList.remove("is-active");
    instructionPanel?.classList.remove("is-open");
    instructionPanel?.setAttribute("aria-hidden", "true");
  });
}

pageMenuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const pageName = item.dataset.page || item.textContent.trim();
    const nextIndex = pageNames.indexOf(pageName);
    if (nextIndex !== -1 && typeof window.navigateToPage === "function") {
      window.navigateToPage(nextIndex);
    }
    setMenuOpen(false);
  });
});

previousPageButton?.addEventListener("click", () => {
  const idx = pageNames.indexOf(currentPageLabel?.textContent.trim() ?? "");
  if (idx > 0 && typeof window.navigateToPage === "function") {
    window.navigateToPage(idx - 1);
  }
});

nextPageButton?.addEventListener("click", () => {
  const idx = pageNames.indexOf(currentPageLabel?.textContent.trim() ?? "");
  if (idx < pageNames.length - 1 && typeof window.navigateToPage === "function") {
    window.navigateToPage(idx + 1);
  }
});

siteLogo?.addEventListener("click", () => {
  if (typeof window.navigateToPage === "function") {
    window.navigateToPage(0);
  }
  setMenuOpen(false);
});
