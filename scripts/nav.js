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
        // Toggle active handled deliberately via setActiveProgressNode
      });
      return { navLink: activeLink, progressIndex: activeProgressIndex };
    }

    var progressIndicator = document.querySelector(".section-progress-indicator");
    var progressTrack = document.querySelector(".section-progress-track");

    var lastProgressIndex = -1;
    var lineAnimating = false;
    var animatingTo = -1;
    var lineHideTimer = null;
    var phase1Timer = null;
    var phase2Timer = null;

    function clearAnimationTimers() {
      if (lineHideTimer) { window.clearTimeout(lineHideTimer); lineHideTimer = null; }
      if (phase1Timer) { window.clearTimeout(phase1Timer); phase1Timer = null; }
      if (phase2Timer) { window.clearTimeout(phase2Timer); phase2Timer = null; }
    }

    function setActiveProgressNode(idx) {
      progressLinks.forEach(function (link, index) {
        link.classList.toggle("is-active", index === idx);
      });
    }

    function gapBetweenAdjacentDots(lowerIdx) {
      var a = progressLinks[lowerIdx].getBoundingClientRect();
      var b = progressLinks[lowerIdx + 1].getBoundingClientRect();
      var tr = progressTrack.getBoundingClientRect();
      return {
        top: a.bottom - tr.top,
        height: Math.max(6, b.top - a.bottom)
      };
    }

    function runGapLineSweep(fromIdx, toIdx) {
      var lower = Math.min(fromIdx, toIdx);
      var g = gapBetweenAdjacentDots(lower);
      var down = toIdx > fromIdx;
      var duration = 180; // A balanced sweet spot between smooth tracking and snappy speed
      var ease = "cubic-bezier(0.2, 0.85, 0.24, 1)"; // Snappy easing

      clearAnimationTimers();
      
      progressIndicator.style.transition = "none";
      progressIndicator.style.opacity = "1";

      // Pulsate the destination node immediately to sync identically with the top nav active state
      setActiveProgressNode(toIdx);

      // Setup initial position (Phase 1 start)
      if (down) {
        progressIndicator.style.top = g.top + "px";
        progressIndicator.style.height = "0px";
      } else {
        progressIndicator.style.top = (g.top + g.height) + "px";
        progressIndicator.style.height = "0px";
      }

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          // Phase 1 (Trace)
          progressIndicator.style.transition = "top " + duration + "ms " + ease + ", height " + duration + "ms " + ease;
          if (down) {
            progressIndicator.style.height = g.height + "px";
          } else {
            progressIndicator.style.top = g.top + "px";
            progressIndicator.style.height = g.height + "px";
          }

          phase1Timer = window.setTimeout(function () {
            // Phase 2 (Erase)
            if (down) {
              progressIndicator.style.top = (g.top + g.height) + "px";
              progressIndicator.style.height = "0px";
            } else {
              progressIndicator.style.height = "0px";
            }

            phase2Timer = window.setTimeout(function () {
              // Cleanup state after erasing
              progressIndicator.style.opacity = "0";
              progressIndicator.style.transition = "none";
              
              lineAnimating = false;
              lastProgressIndex = toIdx;
              animatingTo = -1;

              // Visually hold the rail for 1600ms once Node 2 begins pulsating
              showProgressRailFor(1600, false);
            }, duration);
          }, duration + 10); // Very short transition gap
        });
      });
    }

    function updateProgressIndicator(newIdx) {
      if (!progressIndicator || !progressTrack) { return; }

      if (newIdx < 0 || !progressLinks[newIdx]) {
        clearAnimationTimers();
        setActiveProgressNode(-1);
        progressIndicator.style.opacity = "0";
        lineAnimating = false;
        animatingTo = -1;
        lastProgressIndex = newIdx;
        return;
      }

      if (lineAnimating) {
        if (newIdx === animatingTo) {
          return;
        }
        if (newIdx === lastProgressIndex) {
          return;
        }
        clearAnimationTimers();
        progressIndicator.style.opacity = "0";
        progressIndicator.style.transition = "none";
        progressIndicator.style.height = "0";
        lineAnimating = false;
        animatingTo = -1;
      }

      if (newIdx === lastProgressIndex && lastProgressIndex >= 0) {
        progressIndicator.style.opacity = "0";
        setActiveProgressNode(newIdx);
        return;
      }

      if (lastProgressIndex < 0) {
        lastProgressIndex = newIdx;
        progressIndicator.style.opacity = "0";
        setActiveProgressNode(newIdx);
        return;
      }

      var from = lastProgressIndex;
      var to = newIdx;

      if (Math.abs(to - from) !== 1) {
        lastProgressIndex = to;
        progressIndicator.style.opacity = "0";
        setActiveProgressNode(to);
        return;
      }

      lineAnimating = true;
      animatingTo = to;
      runGapLineSweep(from, to);
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
      var marked = markActiveById(nearestSection.id);
      moveIndicator(marked.navLink);
      updateProgressIndicator(marked.progressIndex);
    }

    var hideRailTimer = null;
    function clearHideRailTimer() {
      if (!hideRailTimer) { return; }
      window.clearTimeout(hideRailTimer);
      hideRailTimer = null;
    }
    
    function showProgressRailFor(ms, checkTop) {
      if (!progressRail) { return; }
      if (checkTop && window.scrollY <= 0) { return; }
      progressRail.classList.add("is-visible");
      clearHideRailTimer();
      hideRailTimer = window.setTimeout(function () {
        progressRail.classList.remove("is-visible");
      }, ms);
    }
    
    function showProgressRailTemporarily() {
      showProgressRailFor(900, true);
    }
    
    function showProgressRailHintOnce() {
      showProgressRailFor(1600, false);
    }

    var scheduleSync = App.scheduleRaf(syncActiveNav);
    var scheduleRailReveal = App.scheduleRaf(showProgressRailTemporarily);

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        requestAnimationFrame(function () {
          moveIndicator(link);
          var href = link.getAttribute("href") || "";
          var idx = progressLinks.findIndex(function (l) {
            return l.getAttribute("href") === href;
          });
          if (idx === -1 && progressLinks.length) {
            idx = progressLinks.length - 1;
          }
          updateProgressIndicator(idx);
        });
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
