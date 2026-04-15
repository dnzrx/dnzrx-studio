(function () {
  var App = window.SiteApp;

  App.alignFlowTimelineLine = function () {
    var flow = document.getElementById("flow");
    if (!flow) { return; }

    var line = flow.querySelector(".timeline-line");
    var dots = flow.querySelectorAll(".timeline-dot");
    if (!line || dots.length < 2) { return; }

    var container = line.parentElement;
    if (!container) { return; }

    var firstDotRect = dots[0].getBoundingClientRect();
    var lastDotRect = dots[dots.length - 1].getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();
    var firstCenter = App.getRectCenter(firstDotRect);
    var lastCenter = App.getRectCenter(lastDotRect);

    var centerX = firstCenter.x - containerRect.left;
    var startY = firstCenter.y - containerRect.top;
    var endY = lastCenter.y - containerRect.top;

    line.style.left = centerX + "px";
    line.style.top = startY + "px";
    line.style.height = Math.max(0, endY - startY) + "px";
    line.style.bottom = "auto";
    line.style.transform = "translateX(-50%)";

    if (dots.length >= 2) {
      var prevDotRect = dots[dots.length - 2].getBoundingClientRect();
      var prevCenter = App.getRectCenter(prevDotRect);
      var finalTop = prevCenter.y - containerRect.top - startY;
      var finalHeight = Math.max(0, endY - (prevCenter.y - containerRect.top));
      line.style.setProperty("--final-segment-top", Math.max(0, finalTop) + "px");
      line.style.setProperty("--final-segment-travel", Math.max(28, finalHeight - 20) + "px");
    }
  };

  App.initTimelineCardObserver = function () {
    var timelineCards = document.querySelectorAll(App.SELECTORS.timelineCard);
    if (!timelineCards.length) { return; }

    var timelineObserver = App.createObserver(function (entry, observer) {
      if (!entry.isIntersecting) { return; }
      var step = parseInt(entry.target.getAttribute("data-step"), 10) || 1;
      entry.target.style.transitionDelay = (step * App.CONFIG.timeline.stepDelay) + "ms";
      entry.target.classList.add("in-view");
      App.alignFlowTimelineLine();
      observer.unobserve(entry.target);
    }, { threshold: App.CONFIG.timeline.threshold, rootMargin: App.CONFIG.timeline.rootMargin });

    timelineCards.forEach(function (card) { timelineObserver.observe(card); });
  };
})();
