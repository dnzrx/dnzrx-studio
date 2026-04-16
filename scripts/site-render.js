(function () {
  function renderWhenReady() {
    var data = window.SiteData;
    if (!data) {
      return;
    }

    renderLinks(data.links || []);
    renderSocials(data.socials || []);
    renderCommissionSectionMeta(data.commissionSection || {});
    renderAddons(data.addons || []);
    renderCommissionNotes(data.commissionNotes || []);
    renderFlowSectionMeta(data.flowSection || {});
    renderTimeline(data.timeline || []);
    renderTcSectionMeta(data.tcSection || {});
    renderPolicies(data.policies || {});
    renderGallerySectionMeta(data.gallerySection || {});
    renderWorks(data.works || [], data.galleryEmptyState || {});
  }

  function socialIconPath(icon) {
    var map = {
      soundcloud: "assets/icons/soundcloud.svg",
      youtube: "assets/icons/youtube.svg",
      x: "assets/icons/x.svg",
      instagram: "assets/icons/instagram.svg"
    };
    return map[icon] || map.soundcloud;
  }

  function renderLinks(links) {
    var navTarget = document.querySelector("[data-render='nav-links']");
    var footerTarget = document.querySelector("[data-render='footer-links']");
    var html = links.map(function (link) {
      return '<li><a class="nav-link text-ethereal-ink/70 hover:text-ethereal-ink" href="' + link.href + '">' + link.label + "</a></li>";
    }).join("");
    if (navTarget) {
      navTarget.innerHTML = html;
    }
    if (footerTarget) {
      footerTarget.innerHTML = links.map(function (link) {
        return "<li><a href=\"" + link.href + "\">" + link.label + "</a></li>";
      }).join("");
    }
  }

  function renderSocials(items) {
    var target = document.querySelector("[data-render='intro-socials']");
    if (!target) {
      return;
    }
    target.innerHTML = items.map(function (item) {
      return '' +
        '<a href="' + item.href + '" target="_blank" rel="noopener noreferrer" aria-label="' + item.label + '" title="' + item.label + '" class="inline-flex items-center justify-center sm:justify-start w-10 h-10 sm:w-auto sm:h-auto sm:gap-2 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 lg:px-[1.15rem] lg:py-2.5 rounded-xl border border-ethereal-line/90 bg-white/92 shadow-sm hover:text-ethereal-ink hover:bg-white transition">' +
        '<img src="' + socialIconPath(item.icon) + '" alt="" class="w-4 h-4" loading="lazy" decoding="async" aria-hidden="true" />' +
        '<span class="hidden sm:inline text-[13px] md:text-sm lg:text-[15px] font-medium text-ethereal-ink/78">' + item.label + "</span>" +
        '<span class="sr-only sm:hidden">' + item.label + "</span>" +
        "</a>";
    }).join("");
  }

  function renderAddons(addons) {
    var mobile = document.querySelector("[data-render='addons-mobile']");
    var desktop = document.querySelector("[data-render='addons-desktop']");
    if (mobile) {
      mobile.innerHTML = addons.map(function (addon) {
        return '' +
          '<article class="commission-addon-item' + (addon.recommended ? " commission-addon-recommended" : "") + ' rounded-xl border border-ethereal-line/80 bg-white p-3">' +
          '<p class="font-semibold text-ethereal-ink">' + addon.item + "</p>" +
          (addon.recommended ? '<p class="text-[11px] font-semibold text-ethereal-roseDark">Recommended</p>' : "") +
          '<p class="mt-1 text-ethereal-ink/72">' + addon.description + "</p>" +
          '<p class="commission-addon-mobile-price"><span class="currency">IDR</span>' + addon.price + "</p>" +
          "</article>";
      }).join("");
    }
    if (desktop) {
      desktop.innerHTML = addons.map(function (addon) {
        return '' +
          '<tr class="' + (addon.recommended ? "commission-addon-recommended-row " : "") + 'hover:bg-ethereal-mist/60 transition-colors">' +
          '<td class="p-4 font-semibold">' + addon.item + (addon.recommended ? ' <span class="text-[11px] font-semibold text-ethereal-roseDark">Recommended</span>' : "") + "</td>" +
          '<td class="p-4"><span class="addon-price-pill">' + addon.price + "</span></td>" +
          '<td class="p-4 text-ethereal-ink/70">' + addon.description + "</td>" +
          "</tr>";
      }).join("");
    }
  }

  function renderCommissionNotes(notes) {
    var target = document.querySelector("[data-render='commission-notes']");
    if (!target) {
      return;
    }
    target.innerHTML = notes.map(function (note) {
      var linkHtml = "";
      if (note.link && note.link.href && note.link.text) {
        linkHtml = ' <a href="' + note.link.href + '" class="underline decoration-ethereal-twilight/60 decoration-[1.5px] underline-offset-2 text-ethereal-ink/85 hover:text-ethereal-ink">' + note.link.text + "</a>";
      }
      return '' +
        "<li>" +
        '<strong class="font-semibold">' + (note.label || "") + ":</strong> " +
        (note.text || "") +
        linkHtml +
        "</li>";
    }).join("");
  }

  function renderCommissionSectionMeta(meta) {
    setText("[data-render='commission-title']", meta.title);
  }

  function renderTimeline(items) {
    var target = document.querySelector("[data-render='timeline-rows']");
    if (!target) {
      return;
    }
    target.innerHTML = items.map(function (item) {
      var left = item.side === "left";
      return '' +
        '<div class="timeline-row timeline-row-' + (left ? "left" : "right") + ' relative pl-10 sm:pl-11 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-10 items-start">' +
        (left ? '<div class="lg:text-right lg:pr-10">' : '<div class="lg:col-start-2 lg:pl-10">') +
        '<article data-step="' + item.step + '" class="timeline-card rounded-2xl p-4 border ' + (item.final ? "border-[#9adbb8]/70 bg-gradient-to-br from-white/90 to-[#dff7e8]/45" : "bg-white/84") + ' block w-full lg:max-w-md ' + (left ? "lg:ml-auto " : "") + 'shadow-sm">' +
        '<h4 class="font-bold flex items-center ' + (left ? "lg:justify-end " : "") + 'gap-2 ' + (item.final ? "text-[#3f9468]" : "") + '">' +
        '<span class="material-symbols-outlined hidden sm:inline ' + (item.final ? "text-[#60d394]" : "text-ethereal-rose") + ' text-[20px]">' + item.icon + "</span>" +
        item.step + ". " + item.title +
        "</h4>" +
        '<p class="text-sm text-ethereal-ink/70 mt-1">' + item.description + "</p>" +
        "</article></div>" +
        '<span class="timeline-dot ' + (item.final ? "timeline-dot-final " : "") + 'absolute left-5 lg:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ' + (item.final ? "w-2 h-2" : "w-3.5 h-3.5") + ' rounded-full bg-ethereal-rose"></span>' +
        "</div>";
    }).join("");
  }

  function renderFlowSectionMeta(meta) {
    setText("[data-render='flow-title']", meta.title);
    setText("[data-render='flow-subtitle']", meta.subtitle);
  }

  function renderTcSectionMeta(meta) {
    setText("[data-render='tc-title']", meta.title);
    setText("[data-render='tc-subtitle']", meta.subtitle);
    setText("[data-render='tc-snapshot-title-mobile']", meta.snapshotTitle);
    setText("[data-render='tc-snapshot-title-desktop']", meta.snapshotTitle);
    setText("[data-render='tc-mobile-hint']", meta.mobileHint);
  }

  function renderPolicies(policies) {
    renderPolicySnapshot("[data-render='policy-snapshot-mobile']", policies.snapshotMobile || []);
    renderPolicySnapshot("[data-render='policy-snapshot-desktop']", policies.snapshotDesktop || []);
    renderPolicyDetailsMobile(policies.details || []);
    renderPolicyCardsDesktop(policies.details || []);
  }

  function renderGallerySectionMeta(meta) {
    setText("[data-render='gallery-eyebrow']", meta.eyebrow);
    setText("[data-render='gallery-title']", meta.title);
  }

  function renderPolicySnapshot(selector, items) {
    var target = document.querySelector(selector);
    if (!target) {
      return;
    }
    target.innerHTML = items.map(function (text) {
      return '' +
        '<li class="tc-snapshot-item">' +
        '<span class="tc-snapshot-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="2"/>' +
        '<path d="M8 12.2l2.5 2.6L16 9.1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>" +
        "</span>" +
        '<span class="tc-snapshot-text">' + text + "</span>" +
        "</li>";
    }).join("");
  }

  function renderPolicyDetailsMobile(items) {
    var target = document.querySelector("[data-render='policy-details-mobile']");
    if (!target) {
      return;
    }
    target.innerHTML = items.map(function (item) {
      return '' +
        '<details class="rounded-2xl border border-ethereal-line bg-white/86 p-4"' + (item.open ? " open" : "") + ">" +
        '<summary class="tc-mobile-summary cursor-pointer list-none font-semibold text-ethereal-ink">' +
        '<span class="tc-mobile-summary-main"><span class="material-symbols-outlined text-ethereal-rose text-[17px]">' + item.icon + "</span>" + item.title + "</span>" +
        '<span class="material-symbols-outlined tc-mobile-indicator text-[18px]">expand_more</span>' +
        "</summary>" +
        '<p class="mt-2 tc-mobile-detail-copy">' + formatMobileHtml(item.mobileHtml) + "</p>" +
        "</details>";
    }).join("");
  }

  function formatMobileHtml(html) {
    if (typeof html !== "string" || !html.length) {
      return "";
    }
    var segments = html
      .split(/<br\s*\/?>/gi)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
    return segments.map(function (segment) {
      return '<span class="tc-mobile-line">' + segment + "</span>";
    }).join("");
  }

  function renderPolicyCardsDesktop(items) {
    var target = document.querySelector("[data-render='policy-cards-desktop']");
    if (!target) {
      return;
    }
    target.innerHTML = items.map(function (item) {
      return '' +
        '<article class="tc-policy-card rounded-2xl p-4 border border-ethereal-line bg-white/84 h-full flex flex-col">' +
        '<h4 class="font-bold text-ethereal-ink mb-2 flex items-center gap-2"><span class="material-symbols-outlined text-ethereal-rose text-[18px]">' + item.icon + "</span>" + item.title + "</h4>" +
        '<ul class="tc-policy-points space-y-1.5 text-ethereal-ink/80">' +
        item.points.map(function (point) {
          return '<li class="tc-policy-point">' + emphasizePolicyPoint(point) + "</li>";
        }).join("") +
        "</ul></article>";
    }).join("");
  }

  function emphasizePolicyPoint(point) {
    if (typeof point !== "string") {
      return "";
    }
    return point
      .replace("Full payment is required", '<span class="tc-emphasis">Full payment is required</span>')
      .replace("Commercial releases must include this credit", '<span class="tc-emphasis">Commercial releases must include this credit</span>')
      .replace("Additional paid work", '<span class="tc-emphasis">Additional paid work</span>')
      .replace("direction preview, not the final master", '<span class="tc-emphasis">direction preview, not the final master</span>');
  }

  function renderWorks(works, emptyState) {
    var target = document.querySelector("[data-render='works-list']");
    if (!target) {
      return;
    }
    if (!works.length) {
      var title = (emptyState && emptyState.title) || "Portfolio updates are on the way.";
      var description = (emptyState && emptyState.description) || "New projects will appear here after release.";
      target.innerHTML = '' +
        '<article class="works-empty-state" aria-live="polite">' +
        '<h3 class="works-empty-title">' + title + "</h3>" +
        '<p class="works-empty-copy">' + description + "</p>" +
        "</article>";
      return;
    }
    target.innerHTML = works.map(function (work) {
      return '' +
        '<article class="work-song-card">' +
        '<img class="work-song-thumb" src="' + work.image + '" alt="' + work.alt + '" />' +
        '<div class="work-song-content">' +
        '<div class="work-song-meta"><p class="work-song-artist">' + work.artist + '</p><h3 class="work-song-title">' + work.title + "</h3></div>" +
        '<a href="' + work.url + '" target="_blank" rel="noopener noreferrer" class="work-song-listen-btn">Listen<span class="material-symbols-outlined" aria-hidden="true">open_in_new</span></a>' +
        "</div></article>";
    }).join("");
  }

  function setText(selector, text) {
    var target = document.querySelector(selector);
    if (!target || typeof text !== "string" || !text.length) {
      return;
    }
    target.textContent = text;
  }

  if (window.__includesReady && typeof window.__includesReady.then === "function") {
    window.__includesReady.then(renderWhenReady);
  } else {
    renderWhenReady();
  }
})();
