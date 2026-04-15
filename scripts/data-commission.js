(function () {
  window.SiteSectionData = window.SiteSectionData || {};
  window.SiteSectionData.commission = {
    section: {
      title: "Commission rate"
    },
    addons: [
      { item: "Vocal Pre-Process", price: "75K", description: "Cleaning, timing, pitch correction.", recommended: true },
      { item: "Extra Tracks", price: "75K", description: "Per track beyond 2." },
      { item: "Extra Length", price: "30K", description: "Per minute over 4:00." },
      { item: "Additional Major Revision", price: "75K", description: "Applied after 2 included rounds." },
      { item: "Scope change fee", price: "150K", description: "See Notes and T&C: Revisions & scope." }
    ],
    notes: [
      { label: "Business days", text: "Excludes Saturdays, Sundays, and Indonesian public holidays." },
      { label: "Scope changes", text: "Apply when requests go beyond the approved brief." },
      { label: "Examples", text: "Rearrangement, session rebuild, new recording, or major direction change." },
      { label: "Timeline impact", text: "Scope changes usually add 3 to 5 business days." },
      {
        label: "Policy details",
        text: "See",
        link: {
          href: "#tc",
          text: "T&C: Revisions & scope"
        }
      },
      { label: "Availability", text: "Indonesia only for now. International support is coming soon." }
    ]
  };
})();
