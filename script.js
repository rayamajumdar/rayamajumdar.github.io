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

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("done");
      entry.target.querySelectorAll(".reveal-children").forEach((el) => el.classList.add("done"));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Nav active state
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const sections = document.querySelectorAll("section[id]");

const setActiveNav = () => {
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 250) current = s.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();

// Back to top
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Lazy load images below the fold
document.querySelectorAll(".proof-grid img, .gsc-grid img, .ppc-proof img, .geo-section img, .ai-overview-section img").forEach((img) => {
  img.loading = "lazy";
});

// Count-up animation
const parseNumInfo = (text) => {
  const m = text.match(/[\d,]+\.?\d*/);
  if (!m) return null;
  const raw = m[0].replace(/,/g, "");
  const num = parseFloat(raw);
  const prefix = text.slice(0, m.index);
  const suffix = text.slice(m.index + m[0].length);
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const hasCommas = m[0].includes(",");
  return { num, prefix, suffix, decimals, hasCommas };
};

const fmtNum = (val, info) => {
  let n = info.decimals > 0 ? val.toFixed(info.decimals) : Math.round(val).toString();
  if (info.hasCommas) {
    const parts = n.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    n = parts.join(".");
  }
  return info.prefix + n + info.suffix;
};

const countUp = (el, start, end, dur) => {
  const info = parseNumInfo(el.textContent);
  if (!info) return;
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmtNum(start + (end - start) * eased, info);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const info = parseNumInfo(el.textContent);
      if (info) countUp(el, 0, info.num, 1200);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".metrics span, .gsc-stats span, .ppc-metrics span").forEach((el) => countObserver.observe(el));
