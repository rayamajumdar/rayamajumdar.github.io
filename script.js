const header = document.querySelector(".site-header");

const setHeaderTone = () => {
  if (window.scrollY > 20) {
    header.style.boxShadow = "0 12px 40px rgba(32, 25, 18, 0.08)";
  } else {
    header.style.boxShadow = "none";
  }
};

setHeaderTone();
window.addEventListener("scroll", setHeaderTone, { passive: true });

// Lightbox
(() => {
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img class="lightbox-image" src="" alt="">';
  document.body.appendChild(overlay);

  const img = overlay.querySelector(".lightbox-image");
  const close = overlay.querySelector(".lightbox-close");

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || "";
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    img.src = "";
  };

  close.addEventListener("click", closeLightbox);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  document.querySelectorAll('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".webp"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const childImg = link.querySelector("img");
      e.preventDefault();
      open(link.href, childImg ? childImg.alt : "");
    });
  });
})();

// Lazy load images below the fold
document.querySelectorAll(".proof-grid img, .gsc-grid img, .ppc-proof img, .geo-section img, .ai-overview-section img").forEach((img) => {
  img.loading = "lazy";
});
