(function () {
  var moduleQueue = [
    "scripts/core.js",
    "scripts/timeline.js",
    "scripts/connectors.js",
    "scripts/reveal.js",
    "scripts/nav.js",
    "scripts/init.js"
  ];

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Failed to load script: " + src));
      };
      document.head.appendChild(script);
    });
  }

  function bootstrap(index) {
    if (index >= moduleQueue.length) {
      return;
    }
    loadScript(moduleQueue[index])
      .then(function () { bootstrap(index + 1); })
      .catch(function (err) { console.error(err); });
  }

  function startApp() {
    bootstrap(0);
  }

  if (window.__includesReady && typeof window.__includesReady.then === "function") {
    window.__includesReady.then(startApp);
  } else {
    startApp();
  }
})();
