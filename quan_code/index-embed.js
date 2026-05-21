(function () {
  const frame = document.getElementById("index-flow-frame");
  const bridgedMessages = new Set(["scrollDown", "scrollUp"]);

  if (!frame) return;

  function postToIndex(message) {
    if (!frame.contentWindow) return;
    frame.contentWindow.postMessage(message, "*");
  }

  function postToOuter(message) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, "*");
    }
  }

  function notifyVisibility() {
    postToIndex({
      type: "pageVisibility",
      isActive: document.body.classList.contains("index-flow-active")
    });
  }

  function getFrameBody() {
    try {
      return frame.contentDocument && frame.contentDocument.body;
    } catch (error) {
      return null;
    }
  }

  function isAtFirstEmbeddedSketch() {
    const frameBody = getFrameBody();

    if (!frameBody) return false;
    return frameBody.classList.contains("sketch2-active") &&
      !frameBody.classList.contains("sketch3-active") &&
      !frameBody.classList.contains("sketch4-active");
  }

  function isAtLastEmbeddedSketch() {
    const frameBody = getFrameBody();

    return Boolean(frameBody && frameBody.classList.contains("sketch3-active"));
  }

  window.UntangleIndexEmbed = {
    notifyVisibility: notifyVisibility,
    postToIndex: postToIndex
  };

  frame.addEventListener("load", notifyVisibility);

  window.addEventListener("message", function (event) {
    const data = event.data;

    if (event.source === frame.contentWindow) {
      if (!bridgedMessages.has(data)) return;

      if (data === "scrollUp" && isAtFirstEmbeddedSketch()) {
        postToOuter("scrollUp");
        return;
      }

      if (data === "scrollDown" && isAtLastEmbeddedSketch()) {
        postToOuter("scrollDown");
        return;
      }

      postToIndex(data);
      return;
    }

    if (data && data.type === "pageVisibility") {
      document.body.classList.toggle("index-flow-active", Boolean(data.isActive));
      notifyVisibility();
      return;
    }

    if (bridgedMessages.has(data)) {
      postToIndex(data);
    }
  });

  if (window.MutationObserver) {
    const observer = new MutationObserver(notifyVisibility);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  notifyVisibility();
})();
