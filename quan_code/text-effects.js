(() => {
  function getNode(target) {
    if (!target) return null;
    if (target.elt instanceof HTMLElement) return target.elt;
    if (target instanceof HTMLElement) return target;
    return null;
  }

  function unwrapKineticWords(node) {
    node.querySelectorAll(".kinetic-word").forEach((word) => {
      word.replaceWith(document.createTextNode(word.textContent || ""));
    });
    node.normalize();
  }

  function prepare(target, options = {}) {
    const node = getNode(target);
    if (!node) return;

    if (options.sourceHtml && node.dataset.kineticSourceHtml !== options.sourceHtml) {
      node.innerHTML = options.sourceHtml;
      node.dataset.kineticSourceHtml = options.sourceHtml;
    }

    node.classList.remove("kinetic-text");
    unwrapKineticWords(node);
  }

  window.UntangleTextFx = { prepare };
})();
