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
const openingFrame = document.getElementById("opening-frame");
const pageNames = Array.from(pageMenuItems).map((item) => item.dataset.page || item.textContent.trim());

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

function setupOpeningMobileTextSnap() {
  if (!openingFrame?.contentDocument) return;

  const frameDocument = openingFrame.contentDocument;
  const footer = frameDocument.querySelector(".opening-footer");
  const members = Array.from(frameDocument.querySelectorAll(".opening-member"));
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  if (!footer || members.length === 0) return;

  if (typeof openingFrame.cleanupOpeningSnap === "function") {
    openingFrame.cleanupOpeningSnap();
  }

  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let isTracking = false;
  let didMoveHorizontally = false;

  function getMemberStep() {
    return members[0]?.getBoundingClientRect().width || footer.clientWidth;
  }

  function snapToNearestMember() {
    const step = getMemberStep();
    const maxIndex = members.length - 1;
    const nextIndex = Math.max(0, Math.min(maxIndex, Math.round(footer.scrollLeft / step)));

    footer.scrollTo({
      left: nextIndex * step,
      behavior: "smooth"
    });
  }

  function onTouchStart(event) {
    if (!mobileQuery.matches || event.touches.length !== 1) return;

    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startScrollLeft = footer.scrollLeft;
    isTracking = true;
    didMoveHorizontally = false;
  }

  function onTouchMove(event) {
    if (!isTracking || !mobileQuery.matches || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;

    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      isTracking = false;
      return;
    }

    didMoveHorizontally = true;
    footer.scrollLeft = startScrollLeft - deltaX;
    event.preventDefault();
  }

  function onTouchEnd() {
    if (isTracking && didMoveHorizontally) {
      snapToNearestMember();
    }
    isTracking = false;
    didMoveHorizontally = false;
  }

  frameDocument.addEventListener("touchstart", onTouchStart, { passive: true });
  frameDocument.addEventListener("touchmove", onTouchMove, { passive: false });
  frameDocument.addEventListener("touchend", onTouchEnd, { passive: true });
  frameDocument.addEventListener("touchcancel", onTouchEnd, { passive: true });

  openingFrame.cleanupOpeningSnap = () => {
    frameDocument.removeEventListener("touchstart", onTouchStart);
    frameDocument.removeEventListener("touchmove", onTouchMove);
    frameDocument.removeEventListener("touchend", onTouchEnd);
    frameDocument.removeEventListener("touchcancel", onTouchEnd);
    openingFrame.cleanupOpeningSnap = null;
  };
}

openingFrame?.addEventListener("load", setupOpeningMobileTextSnap);

if (openingFrame?.contentDocument?.readyState === "complete") {
  setupOpeningMobileTextSnap();
}
