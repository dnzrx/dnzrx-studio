(function () {
  var App = window.SiteApp;

  App.initNavActiveIndicator = function () {
    var wrap = document.querySelector(App.SELECTORS.navLinksWrap);
    var navLinks = App.toArray(document.querySelectorAll(App.SELECTORS.navLink));
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
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === ("#" + sectionId);
        link.classList.toggle("is-active", isActive);
        if (isActive) { activeLink = link; }
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

    var scheduleSync = App.scheduleRaf(syncActiveNav);

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        requestAnimationFrame(function () { moveIndicator(link); });
      });
    });

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    syncActiveNav();
  };
})();
