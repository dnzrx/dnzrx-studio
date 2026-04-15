(function () {
  window.SiteSectionData = window.SiteSectionData || {};
  window.SiteSectionData.flow = {
    section: {
      title: "Commission flow",
      subtitle: "Simple 6-step process from first DM to final master."
    },
    timeline: [
      { step: 1, title: "Contact", icon: "chat", side: "left", description: "Reach me via DM on Discord (@dnzrx)." },
      { step: 2, title: "Discussion", icon: "forum", side: "right", description: "Share your artistic goals, reference tracks, and stem files for review." },
      { step: 3, title: "Rough Sample", icon: "graphic_eq", side: "left", description: "I'll provide a rough mix sample (pre-payment) so you can approve the overall direction." },
      { step: 4, title: "Order & Pay", icon: "payments", side: "right", description: "Once approved, place the order. Full payment required via Discord agreement." },
      { step: 5, title: "Production", icon: "settings_input_component", side: "left", description: "The mix is finalized. You have a feedback window for those 2 included major revisions." },
      { step: 6, title: "Delivery", icon: "task_alt", side: "right", description: "Final high-resolution masters delivered via your preferred file sharing platform.", final: true }
    ]
  };
})();
