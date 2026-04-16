(function () {
  var App = window.SiteApp;
  var state = App.state;
  var SELECTORS = {
    nav: "nav.glass-nav",
    intro: "#intro",
    commissionSection: "#commission",
    commissionGrid: "#commission .panel > .grid",
    commissionPackageCard: "#commission .panel > .grid > article",
    commissionAddonCard: "#commission .panel > .grid > aside"
  };

  function syncIntroTopSpacing() {
    var nav = document.querySelector(SELECTORS.nav);
    var intro = document.querySelector(SELECTORS.intro);
    if (!nav || !intro) { return; }

    var navHeight = Math.ceil(nav.getBoundingClientRect().height || 0);
    var extraGap = window.innerWidth < 640 ? 16 : 20;
    intro.style.paddingTop = (navHeight + extraGap) + "px";
  }

  function syncCommissionAddonMode() {
    var commissionSection = document.querySelector(SELECTORS.commissionSection);
    var packageCard = document.querySelector(SELECTORS.commissionPackageCard);
    var addonCard = document.querySelector(SELECTORS.commissionAddonCard);
    if (!commissionSection || !packageCard || !addonCard) { return; }

    // If both cards share nearly the same top offset, commission is in 2-column mode.
    var topDelta = Math.abs(packageCard.getBoundingClientRect().top - addonCard.getBoundingClientRect().top);
    commissionSection.classList.toggle("commission-two-col", topDelta < 2);
  }

  function initResizeObservers() {
    if (!("ResizeObserver" in window)) { return; }

    var panelResizeObserver = new ResizeObserver(function () { App.scheduleConnectorRefresh(); });
    state.connectPanels.forEach(function (panel) { panelResizeObserver.observe(panel); });

    var flowTimeline = document.querySelector(App.SELECTORS.flowPanel);
    if (!flowTimeline) { return; }

    var flowObserver = new ResizeObserver(function () { App.alignFlowTimelineLine(); });
    flowObserver.observe(flowTimeline);

    var commissionGrid = document.querySelector(SELECTORS.commissionGrid);
    if (!commissionGrid) { return; }

    var commissionObserver = new ResizeObserver(syncCommissionAddonMode);
    commissionObserver.observe(commissionGrid);
  }

  function init() {
    App.scheduleConnectorRefresh();
    App.alignFlowTimelineLine();
    syncIntroTopSpacing();
    syncCommissionAddonMode();

    ["load", "resize"].forEach(function (eventName) {
      var options = eventName === "resize" ? { passive: true } : undefined;
      window.addEventListener(eventName, App.scheduleConnectorRefresh, options);
      window.addEventListener(eventName, App.alignFlowTimelineLine, options);
      window.addEventListener(eventName, syncIntroTopSpacing, options);
      window.addEventListener(eventName, syncCommissionAddonMode, options);
    });

    initResizeObservers();
    App.initRevealObserver();
    App.initTimelineCardObserver();
    App.initNavActiveIndicator();
  }

  init();
})();
