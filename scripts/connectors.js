(function () {
  var App = window.SiteApp;
  var state = App.state;

  App.buildConnectors = function () {
    if (!state.connectorHost || state.connectPanels.length < 2) { return; }

    state.connectorHost.innerHTML = "";
    state.connectorPairs = [];
    var scroll = App.getPageScroll();

    for (var i = 0; i < state.connectPanels.length - 1; i++) {
      var currentRect = state.connectPanels[i].getBoundingClientRect();
      var nextRect = state.connectPanels[i + 1].getBoundingClientRect();
      var startY = currentRect.bottom + scroll.y;
      var endY = nextRect.top + scroll.y;
      var lineHeight = endY - startY;
      if (lineHeight < App.CONFIG.connector.minHeight) { continue; }

      var currentCenter = App.getRectCenter(currentRect);
      var nextCenter = App.getRectCenter(nextRect);
      var centerX = ((currentCenter.x + nextCenter.x) / 2) + scroll.x;

      var line = document.createElement("span");
      line.className = "section-connector-line";
      line.style.left = (centerX - App.CONFIG.connector.halfWidth) + "px";
      line.style.top = startY + "px";
      line.style.height = lineHeight + "px";
      state.connectorHost.appendChild(line);

      state.connectorPairs.push({ id: i, line: line, target: state.connectPanels[i + 1] });
    }
  };

  App.bindConnectorObserver = function () {
    if (!state.connectorPairs.length) { return; }
    if (state.connectorObserver) { state.connectorObserver.disconnect(); }

    state.connectorObserver = App.createObserver(function (entry) {
      if (!entry.isIntersecting || !entry.target._connectorLine) { return; }
      var meta = entry.target._connectorMeta;
      if (meta) { state.connectorPlayed[meta.id] = true; }
      entry.target._connectorLine.classList.add("in-view");
      state.connectorObserver.unobserve(entry.target);
    }, { threshold: App.CONFIG.connector.threshold, rootMargin: App.CONFIG.connector.rootMargin });

    state.connectorPairs.forEach(function (pair) {
      if (state.connectorPlayed[pair.id]) {
        pair.line.classList.add("instant");
        return;
      }
      pair.target._connectorLine = pair.line;
      pair.target._connectorMeta = { id: pair.id };
      state.connectorObserver.observe(pair.target);
    });
  };

  App.scheduleConnectorRefresh = function () {
    if (state.connectorTicking) { return; }
    state.connectorTicking = true;
    requestAnimationFrame(function () {
      App.buildConnectors();
      App.bindConnectorObserver();
      state.connectorTicking = false;
    });
  };
})();
