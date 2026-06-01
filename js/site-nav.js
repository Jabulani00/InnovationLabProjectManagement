/**
 * Injects shared Innovation Lab navigation on every page.
 * Set <body data-lab-page="index|handbook|agrichain|stars-docs|stars-submit|report">
 */
(function () {
  const PAGES = [
    { id: "index", href: "index.html", label: "Hub" },
    { id: "handbook", href: "innovation_lab_handbook.html", label: "Handbook" },
    { id: "agrichain", href: "agrichain.html", label: "AgriChain" },
    { id: "stars-docs", href: "stars-supabase.html", label: "STARS Docs" },
    { id: "stars-submit", href: "stars-submit.html", label: "STARS Submit" },
    { id: "report", href: "new.html", label: "Progress Report" }
  ];

  const mount = document.getElementById("lab-site-nav");
  if (!mount) return;

  const current = document.body.getAttribute("data-lab-page") || "";

  const inner = document.createElement("div");
  inner.className = "lab-site-nav-inner";

  const brand = document.createElement("a");
  brand.className = "lab-site-nav-brand";
  brand.href = "index.html";
  brand.innerHTML = '<span>Innovation Lab</span> · Site';
  inner.appendChild(brand);

  PAGES.forEach((p) => {
    const a = document.createElement("a");
    a.className = "lab-nav-link";
    a.href = p.href;
    a.textContent = p.label;
    if (p.id === current) a.setAttribute("aria-current", "page");
    inner.appendChild(a);
  });

  mount.classList.add("lab-site-nav");
  mount.appendChild(inner);
})();
