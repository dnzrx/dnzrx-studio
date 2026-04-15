(function () {
  var App = window.SiteApp;

  App.initRevealObserver = function () {
    var reveals = document.querySelectorAll(App.SELECTORS.reveal);
    if (!reveals.length) { return; }

    var revealObserver = App.createObserver(function (entry, observer) {
      if (!entry.isIntersecting) { return; }
      entry.target.classList.add("in-view");

      var anchorPanel = entry.target.closest(App.SELECTORS.connectPanel);
      if (anchorPanel) {
        App.onTransitionEndOnce(entry.target, function (event) {
          if (event.propertyName !== "transform" && event.propertyName !== "opacity") { return; }
          App.scheduleConnectorRefresh();
          App.alignFlowTimelineLine();
        });
      }

      observer.unobserve(entry.target);
    }, { threshold: App.CONFIG.reveal.threshold, rootMargin: App.CONFIG.reveal.rootMargin });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  };
})();
