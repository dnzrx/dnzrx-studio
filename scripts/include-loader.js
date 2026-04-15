(function () {
  var includeNodes = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));
  if (!includeNodes.length) {
    window.__includesReady = Promise.resolve();
    return;
  }

  function injectOne(node) {
    var src = node.getAttribute("data-include");
    if (!src) {
      return Promise.resolve();
    }

    return fetch(src, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Include request failed: " + src + " (" + res.status + ")");
        }
        return res.text();
      })
      .then(function (html) {
        node.outerHTML = html;
      });
  }

  window.__includesReady = includeNodes
    .reduce(function (chain, node) {
      return chain.then(function () {
        return injectOne(node);
      });
    }, Promise.resolve())
    .then(function () {
      window.dispatchEvent(new CustomEvent("includes:ready"));
    })
    .catch(function (err) {
      console.error(err);
      window.dispatchEvent(new CustomEvent("includes:ready"));
    });
})();
