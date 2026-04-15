(function () {
  var App = window.SiteApp;
  var state = App.state;

  function initResizeObservers() {
    if (!("ResizeObserver" in window)) { return; }

    var panelResizeObserver = new ResizeObserver(function () { App.scheduleConnectorRefresh(); });
    state.connectPanels.forEach(function (panel) { panelResizeObserver.observe(panel); });

    var flowTimeline = document.querySelector(App.SELECTORS.flowPanel);
    if (!flowTimeline) { return; }

    var flowObserver = new ResizeObserver(function () { App.alignFlowTimelineLine(); });
    flowObserver.observe(flowTimeline);
  }

  function init() {
    App.scheduleConnectorRefresh();
    App.alignFlowTimelineLine();

    ["load", "resize"].forEach(function (eventName) {
      var options = eventName === "resize" ? { passive: true } : undefined;
      window.addEventListener(eventName, App.scheduleConnectorRefresh, options);
      window.addEventListener(eventName, App.alignFlowTimelineLine, options);
    });

    initResizeObservers();
    App.initRevealObserver();
    App.initTimelineCardObserver();
    App.initNavActiveIndicator();
  }

  init();
})();
