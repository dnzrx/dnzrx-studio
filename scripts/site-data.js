(function () {
  var sections = window.SiteSectionData || {};

  window.SiteData = {
    links: (sections.navigation && sections.navigation.links) || [],
    socials: (sections.intro && sections.intro.socials) || [],
    addons: (sections.commission && sections.commission.addons) || [],
    commissionSection: (sections.commission && sections.commission.section) || {},
    commissionNotes: (sections.commission && sections.commission.notes) || [],
    flowSection: (sections.flow && sections.flow.section) || {},
    timeline: (sections.flow && sections.flow.timeline) || [],
    tcSection: (sections.tc && sections.tc.section) || {},
    policies: (sections.tc && sections.tc.policies) || {},
    gallerySection: (sections.gallery && sections.gallery.section) || {},
    works: (sections.gallery && sections.gallery.works) || [],
    galleryEmptyState: (sections.gallery && sections.gallery.emptyState) || null
  };
})();
