(function () {
  var App = window.SiteApp;

  App.initNavActiveIndicator = function () {
    var wrap = document.querySelector(App.SELECTORS.navLinksWrap);
    var navLinks = App.toArray(document.querySelectorAll(App.SELECTORS.navLink));
    var progressLinks = App.toArray(document.querySelectorAll(".section-progress-link[href^='#']"));
    var progressRail = document.querySelector(".section-progress-rail");
    var sections = App.toArray(document.querySelectorAll(App.SELECTORS.section));
    if (!wrap || !navLinks.length || !sections.length) { return; }

    var indicator = wrap.querySelector(".nav-active-indicator");
    if (!indicator) {
      indicator = document.createElement("span");
      indicator.className = "nav-active-indicator";
      wrap.appendChild(indicator);
    }

    function markActiveById(sectionId) {
      var activeLink = null;
      var activeProgressIndex = -1;
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === ("#" + sectionId);
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          activeLink = link;
        }
      });
      activeProgressIndex = progressLinks.findIndex(function (link) {
        return link.getAttribute("href") === ("#" + sectionId);
      });
      if (activeProgressIndex === -1 && progressLinks.length) {
        activeProgressIndex = progressLinks.length - 1;
      }
      progressLinks.forEach(function (link, index) {
        var isActive = index === activeProgressIndex;
        link.classList.toggle("is-active", isActive);
      });
      return activeLink;
    }

    function moveIndicator(link) {
      if (!link) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.transform = "translateX(" + link.offsetLeft + "px)";
      indicator.style.width = link.offsetWidth + "px";
      indicator.style.opacity = "1";
    }

    function syncActiveNav() {
      var nearestSection = App.getNearestSectionByAnchor(sections, 0.4);
      if (!nearestSection) { return; }
      moveIndicator(markActiveById(nearestSection.id));
    }

    var hideRailTimer = null;
    function clearHideRailTimer() {
      if (!hideRailTimer) { return; }
      window.clearTimeout(hideRailTimer);
      hideRailTimer = null;
    }
    function showProgressRailTemporarily() {
      if (!progressRail || window.scrollY <= 0) { return; }
      progressRail.classList.add("is-visible");
      clearHideRailTimer();
      hideRailTimer = window.setTimeout(function () {
        progressRail.classList.remove("is-visible");
      }, 900);
    }
    function showProgressRailHintOnce() {
      if (!progressRail) { return; }
      progressRail.classList.add("is-visible");
      clearHideRailTimer();
      hideRailTimer = window.setTimeout(function () {
        progressRail.classList.remove("is-visible");
      }, 1200);
    }

    var scheduleSync = App.scheduleRaf(syncActiveNav);
    var scheduleRailReveal = App.scheduleRaf(showProgressRailTemporarily);

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        requestAnimationFrame(function () { moveIndicator(link); });
      });
    });

    window.addEventListener("scroll", function () {
      scheduleSync();
      scheduleRailReveal();
    }, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    if (progressRail) {
      progressRail.classList.remove("is-visible");
      window.setTimeout(showProgressRailHintOnce, 260);
    }
    syncActiveNav();
  };
})();
