(function () {
  var App = (window.SiteApp = window.SiteApp || {});

  App.CONFIG = {
    connector: { threshold: 0.15, rootMargin: "0px 0px -8% 0px", minHeight: 20, halfWidth: 3.5 },
    reveal: { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    timeline: { threshold: 0.25, rootMargin: "0px 0px -10% 0px", stepDelay: 90 }
  };

  App.SELECTORS = {
    connectPanel: "[data-connect-panel]",
    reveal: ".reveal",
    timelineCard: ".timeline-card",
    flowPanel: "#flow .panel",
    navLinksWrap: ".nav-links",
    navLink: ".nav-links a[href^='#']",
    section: "section[id]"
  };

  App.toArray = function (nodeList) {
    return Array.prototype.slice.call(nodeList);
  };

  App.getPageScroll = function () {
    return { x: window.scrollX || window.pageXOffset, y: window.scrollY || window.pageYOffset };
  };

  App.getRectCenter = function (rect) {
    return { x: rect.left + (rect.width / 2), y: rect.top + (rect.height / 2) };
  };

  App.createObserver = function (callback, options) {
    return new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        callback(entry, observer);
      });
    }, options);
  };

  App.scheduleRaf = function (task) {
    var ticking = false;
    return function () {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        task();
      });
    };
  };

  App.getNearestSectionByAnchor = function (sections, anchorRatio) {
    if (!sections.length) { return null; }
    var vh = window.innerHeight || document.documentElement.clientHeight || 1;
    var anchor = vh * anchorRatio;
    var winner = sections[0];
    var minDist = Number.POSITIVE_INFINITY;

    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var center = rect.top + (rect.height / 2);
      var dist = Math.abs(center - anchor);
      if (dist < minDist) {
        minDist = dist;
        winner = section;
      }
    });

    return winner;
  };

  App.onTransitionEndOnce = function (el, handler) {
    if (!el) { return; }
    var wrapped = function (event) {
      handler(event);
      el.removeEventListener("transitionend", wrapped);
    };
    el.addEventListener("transitionend", wrapped);
  };

  App.state = {
    connectorHost: document.getElementById("section-connectors"),
    connectPanels: App.toArray(document.querySelectorAll(App.SELECTORS.connectPanel)),
    connectorPairs: [],
    connectorObserver: null,
    connectorPlayed: Object.create(null),
    connectorTicking: false
  };
})();
