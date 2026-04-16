(function () {
  var App = window.SiteApp;
  var state = App.state;
  var SELECTORS = {
    nav: "nav.glass-nav",
    intro: "#intro"
  };

  function syncIntroTopSpacing() {
    var nav = document.querySelector(SELECTORS.nav);
    var intro = document.querySelector(SELECTORS.intro);
    if (!nav || !intro) { return; }

    var navHeight = Math.ceil(nav.getBoundingClientRect().height || 0);
    var extraGap = window.innerWidth < 640 ? 16 : 20;
    intro.style.paddingTop = (navHeight + extraGap) + "px";
  }

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
    syncIntroTopSpacing();

    ["load", "resize"].forEach(function (eventName) {
      var options = eventName === "resize" ? { passive: true } : undefined;
      window.addEventListener(eventName, App.scheduleConnectorRefresh, options);
      window.addEventListener(eventName, App.alignFlowTimelineLine, options);
      window.addEventListener(eventName, syncIntroTopSpacing, options);
    });

    initResizeObservers();
    App.initRevealObserver();
    App.initTimelineCardObserver();
    App.initNavActiveIndicator();
  }

  init();
})();
