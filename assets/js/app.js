const PLACEHOLDER_IMAGE = "assets/img/hero-placeholder.svg";
const PRINCIPAL_PLACEHOLDER = "assets/img/principal-placeholder.svg";
const HOME_PAGE_IDS = [
  "heroSlides",
  "sliderDots",
  "serviceList",
  "featuredInfoList",
  "newsList",
  "agendaList",
  "achievementList",
  "statisticsList",
  "programList",
  "galleryList",
];

const getEl = (id) => document.getElementById(id);
const setHTML = (id, value) => {
  const element = getEl(id);
  if (element) element.innerHTML = value;
};
const setText = (id, value) => {
  const element = getEl(id);
  if (element) element.textContent = value;
};

function renderSharedChrome(data) {
  const topbarMarkup = `
    <div class="container topbar-inner">
      <p><i class="fa-solid fa-location-dot"></i><span data-text="address">Alamat sekolah</span></p>
      <div class="topbar-contact">
        <a data-link="phone" href="#"><i class="fa-solid fa-phone"></i><span data-text="phone">Telepon</span></a>
        <a data-link="email" href="#"><i class="fa-solid fa-envelope"></i><span data-text="email">Email</span></a>
        <div class="social-links" aria-label="Media sosial sekolah">
          <a data-social="instagram" href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a data-social="facebook" href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a data-social="youtube" href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          <a data-social="tiktok" href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
          <a data-social="twitter" href="#" aria-label="X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>
          <a data-social="linkedin" href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
      </div>
    </div>`;

  let topbar = document.querySelector(".topbar");
  if (!topbar) {
    topbar = document.createElement("div");
    topbar.className = "topbar";
    document.body.insertBefore(topbar, document.body.firstChild);
  }
  topbar.innerHTML = topbarMarkup;

  const header = document.querySelector(".site-header");
  if (!header) return;

  const currentPage = document.body.dataset.page || "home";
  const profilePages = ["profil", "visiMisi", "sejarah", "direktori", "fasilitas", "ekstrakurikuler"];
  const infoPages = ["berita", "spp", "ppdb", "layanan", "direktori"];
  const servicePages = ["layanan", "e-learning", "e-rapor", "perpustakaan", "jadwal", "unduhan"];
  const activeHref =
    currentPage === "home"
      ? "#beranda"
      : profilePages.includes(currentPage)
      ? "profil"
      : servicePages.includes(currentPage)
      ? "layanan"
      : infoPages.includes(currentPage)
      ? "info"
      : `${currentPage}.html`;
  const profileActive = ["profil", "visiMisi", "sejarah", "direktori", "fasilitas", "ekstrakurikuler"].includes(currentPage);
  const infoPublicActive = infoPages.includes(currentPage) || currentPage === "berita";
  const serviceActive = servicePages.includes(currentPage);

  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="index.html#beranda" aria-label="Kembali ke beranda">
        <img id="logo" src="assets/img/logo-placeholder.svg" alt="Logo sekolah" />
        <span class="brand-copy">
          <strong data-text="schoolName">Nama Sekolah</strong>
          <small data-text="tagline">Tagline sekolah</small>
        </span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-navigation">
        <span class="sr-only">Buka menu navigasi</span>
        <i class="fa-solid fa-bars"></i>
      </button>
      <nav class="main-nav" id="main-navigation" aria-label="Navigasi utama">
        <a class="${activeHref === "#beranda" ? "active" : ""}" href="index.html#beranda">Beranda</a>
        <div class="nav-dropdown">
          <button class="nav-dropdown-toggle${profileActive ? " active" : ""}" type="button" aria-expanded="false">
            Profil <i class="fa-solid fa-chevron-down"></i>
          </button>
          <div class="nav-dropdown-menu">
            <a href="profil.html">Profil Sekolah</a>
            <a href="visi-misi.html">Visi dan Misi</a>
            <a href="sejarah.html">Sejarah Sekolah</a>
            <a href="fasilitas.html">Sarana &amp; Prasarana</a>
            <a href="ekstrakurikuler.html">Ekstrakurikuler</a>
            <a href="direktori-guru.html">Direktori GTK</a>
          </div>
        </div>
        <a class="${activeHref === "#akademik" ? "active" : ""}" href="index.html#akademik">Akademik</a>
        <a class="${activeHref === "#kesiswaan" ? "active" : ""}" href="index.html#kesiswaan">Kesiswaan</a>
        <div class="nav-dropdown">
          <button class="nav-dropdown-toggle${serviceActive ? " active" : ""}" type="button" aria-expanded="false">
            Layanan <i class="fa-solid fa-chevron-down"></i>
          </button>
          <div class="nav-dropdown-menu nav-dropdown-menu-wide">
            <a href="layanan.html">Pusat Layanan</a>
            <a href="e-learning.html">E-Learning</a>
            <a href="e-rapor.html">E-Rapor</a>
            <a href="perpustakaan.html">Perpustakaan Digital</a>
            <a href="jadwal.html">Jadwal Pelajaran</a>
            <a href="unduhan.html">Unduh Dokumen</a>
          </div>
        </div>
        <div class="nav-dropdown">
          <button class="nav-dropdown-toggle${infoPublicActive ? " active" : ""}" type="button" aria-expanded="false">
            Informasi Publik <i class="fa-solid fa-chevron-down"></i>
          </button>
          <div class="nav-dropdown-menu nav-dropdown-menu-wide">
            <a href="berita.html">Berita &amp; Pengumuman</a>
            <a href="spp.html">Informasi SPP</a>
            <a href="ppdb.html">PPDB / SPMB</a>
            <a href="direktori-guru.html">Direktori GTK</a>
            <a href="layanan.html">Pusat Layanan</a>
          </div>
        </div>
        <a class="${activeHref === "galeri.html" ? "active" : ""}" href="galeri.html">Galeri</a>
        <a class="${activeHref === "#kontak" ? "active" : ""}" href="index.html#kontak">Kontak</a>
        <a class="nav-cta" data-link="admissionUrl" href="ppdb.html">SPMB / PPDB</a>
      </nav>
    </div>`;
}

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const safeUrl = (value, fallback = "#") => {
  if (!value) return fallback;
  const url = String(value).trim();
  if (url.startsWith("#") || url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
    return url;
  }

  try {
    const parsed = new URL(url, window.location.href);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol) ? url : fallback;
  } catch {
    return fallback;
  }
};


const PAGE_META = {
  home: { label: "Beranda", url: "index.html#beranda", group: "beranda" },
  profil: { label: "Profil Sekolah", url: "profil.html", group: "profil" },
  visiMisi: { label: "Visi dan Misi", url: "visi-misi.html", group: "profil" },
  sejarah: { label: "Sejarah Sekolah", url: "sejarah.html", group: "profil" },
  fasilitas: { label: "Sarana dan Prasarana", url: "fasilitas.html", group: "profil" },
  ekstrakurikuler: { label: "Ekstrakurikuler", url: "ekstrakurikuler.html", group: "profil" },
  direktori: { label: "Direktori GTK", url: "direktori-guru.html", group: "profil" },
  layanan: { label: "Pusat Layanan", url: "layanan.html", group: "layanan" },
  "e-learning": { label: "E-Learning", url: "e-learning.html", group: "layanan" },
  "e-rapor": { label: "E-Rapor", url: "e-rapor.html", group: "layanan" },
  perpustakaan: { label: "Perpustakaan Digital", url: "perpustakaan.html", group: "layanan" },
  jadwal: { label: "Jadwal Pelajaran", url: "jadwal.html", group: "layanan" },
  unduhan: { label: "Unduh Dokumen", url: "unduhan.html", group: "layanan" },
  berita: { label: "Berita dan Pengumuman", url: "berita.html", group: "informasi" },
  spp: { label: "Informasi SPP", url: "spp.html", group: "informasi" },
  ppdb: { label: "PPDB / SPMB", url: "ppdb.html", group: "informasi" },
  galeri: { label: "Galeri", url: "galeri.html", group: "galeri" },
};

const RELATED_PAGES = {
  profil: ["visiMisi", "sejarah", "fasilitas"],
  visiMisi: ["profil", "sejarah", "fasilitas"],
  sejarah: ["profil", "visiMisi", "galeri"],
  fasilitas: ["ekstrakurikuler", "galeri", "profil"],
  ekstrakurikuler: ["fasilitas", "galeri", "berita"],
  direktori: ["profil", "layanan", "berita"],
  layanan: ["ppdb", "spp", "unduhan"],
  "e-learning": ["layanan", "jadwal", "perpustakaan"],
  "e-rapor": ["layanan", "unduhan", "ppdb"],
  perpustakaan: ["layanan", "e-learning", "galeri"],
  jadwal: ["layanan", "berita", "unduhan"],
  unduhan: ["layanan", "ppdb", "spp"],
  berita: ["ppdb", "galeri", "layanan"],
  spp: ["ppdb", "layanan", "unduhan"],
  ppdb: ["spp", "layanan", "direktori"],
  galeri: ["berita", "fasilitas", "ekstrakurikuler"],
};

function pageMeta(key) {
  return PAGE_META[key] || { label: "Halaman", url: "index.html", group: "beranda" };
}

function renderBreadcrumb() {
  const pageKey = document.body.dataset.page || "home";
  if (pageKey === "home") return;
  const bannerInner = document.querySelector(".page-banner-inner");
  if (!bannerInner || bannerInner.querySelector(".breadcrumb")) return;

  const current = pageMeta(pageKey);
  const groupLabel =
    current.group === "profil"
      ? "Profil"
      : current.group === "layanan"
      ? "Layanan"
      : current.group === "informasi"
      ? "Informasi Publik"
      : current.group === "galeri"
      ? "Galeri"
      : "Website";

  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "breadcrumb";
  breadcrumb.setAttribute("aria-label", "Breadcrumb");
  breadcrumb.innerHTML =
    '<a href="index.html#beranda">Beranda</a>' +
    '<i class="fa-solid fa-chevron-right"></i>' +
    '<span>' + escapeHtml(groupLabel) + '</span>' +
    '<i class="fa-solid fa-chevron-right"></i>' +
    '<strong>' + escapeHtml(current.label) + '</strong>';
  bannerInner.prepend(breadcrumb);
}

function renderRelatedPages() {
  const pageKey = document.body.dataset.page || "home";
  const related = (RELATED_PAGES[pageKey] || []).filter((key) => PAGE_META[key]);
  if (!related.length) return;
  const host = document.querySelector(".content-panel");
  if (!host || host.querySelector(".related-pages")) return;

  const cards = related
    .map((key) => {
      const item = pageMeta(key);
      return '<a class="related-page-card" href="' + escapeHtml(item.url) + '"><span>' + escapeHtml(item.label) + '</span><i class="fa-solid fa-arrow-right"></i></a>';
    })
    .join("");

  host.insertAdjacentHTML(
    "beforeend",
    '<section class="related-pages reveal-item"><div><p class="section-kicker">Jelajahi Halaman</p><h3>Halaman terkait</h3></div><div class="related-page-grid">' + cards + '</div></section>'
  );
}

function markActiveNavigation() {
  const pageKey = document.body.dataset.page || "home";
  const current = pageMeta(pageKey);
  const nav = document.querySelector(".main-nav");
  if (!nav) return;
  nav.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isHome = pageKey === "home" && href === "index.html#beranda";
    const isCurrentPage = current.url && href === current.url;
    const isSameFile = current.url && href.split("#")[0] === current.url.split("#")[0];
    const active = Boolean(isHome || isCurrentPage || (pageKey !== "home" && isSameFile));
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
  });
}

function setupScrollReveal() {
  const items = document.querySelectorAll(
    ".section-heading, .service-card, .featured-info-card, .content-panel, .sidebar-card, .info-highlight-card, .content-block, .news-card, .agenda-item, .achievement-card, .stat-card, .program-card, .gallery-item, .teacher-card, .feature-card, .facility-photo-card, .facility-stat-card, .related-pages"
  );
  items.forEach((item) => item.classList.add("reveal-item"));

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 }
  );

  items.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", Math.min(index % 8, 6) * 45 + "ms");
    observer.observe(item);
  });
}

function setupPageTransitions() {
  if (document.body.dataset.transitionReady) return;
  document.body.dataset.transitionReady = "true";
  window.requestAnimationFrame(() => document.body.classList.add("page-ready"));

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute("download") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    const target = new URL(href, window.location.href);
    const current = new URL(window.location.href);
    if (target.origin !== current.origin || (target.pathname === current.pathname && target.hash)) return;

    event.preventDefault();
    document.body.classList.add("page-leaving");
    window.setTimeout(() => {
      window.location.href = target.href;
    }, 70);
  });
}

function enrichPageExperience() {
  renderBreadcrumb();
  renderRelatedPages();
  markActiveNavigation();
  setupScrollReveal();
  setupPageTransitions();
}

function newsDetailUrl(index) {
  return `detail-berita.html?id=${encodeURIComponent(index)}`;
}

function attachImageFallbacks(root = document) {
  root.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        const fallback = image.dataset.fallback || PLACEHOLDER_IMAGE;
        image.classList.add("image-failed");
        if (!image.src.endsWith(fallback)) image.src = fallback;
      },
      { once: true }
    );
  });
}

function renderText(data) {
  document.querySelectorAll("[data-text]").forEach((element) => {
    const value = data[element.dataset.text];
    if (value !== undefined && value !== null) element.textContent = value;
  });
}

function renderLinks(data) {
  document.querySelectorAll("[data-link]").forEach((element) => {
    element.href = safeUrl(data[element.dataset.link], element.getAttribute("href") || "#");
  });

  const compactPhone = String(data.phone || "").replace(/[^\d+]/g, "");
  const email = String(data.email || "").trim();
  const phoneLink = document.querySelector('[data-link="phone"]');
  const emailLink = document.querySelector('[data-link="email"]');
  if (phoneLink && compactPhone) phoneLink.href = `tel:${compactPhone}`;
  if (emailLink && email) emailLink.href = `mailto:${email}`;

  document.querySelectorAll("[data-social]").forEach((element) => {
    const href = safeUrl(data.socialMedia?.[element.dataset.social]);
    element.href = href;
    if (href !== "#") {
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    } else {
      element.hidden = true;
    }
  });
}

function renderImages(data) {
  const logo = document.getElementById("logo");
  const footerLogo = document.getElementById("footerLogo");
  const principal = document.getElementById("principalPhoto");

  [logo, footerLogo].filter(Boolean).forEach((image) => {
    image.src = safeUrl(data.logo, "assets/img/logo-placeholder.svg");
    image.dataset.fallback = "assets/img/logo-placeholder.svg";
  });

  if (principal) {
    principal.src = safeUrl(data.principalPhoto, PRINCIPAL_PLACEHOLDER);
    principal.dataset.fallback = PRINCIPAL_PLACEHOLDER;
  }
}

function renderServices(services = []) {
  const container = getEl("serviceList");
  if (!container) return;
  container.innerHTML = services
    .map(
      (item) => `
        <a class="service-card" href="${escapeHtml(safeUrl(item.url))}">
          <i class="fa-solid ${escapeHtml(item.icon || "fa-link")}"></i>
          <span>${escapeHtml(item.title)}</span>
        </a>
      `
    )
    .join("");
}

function renderVisionMission(data) {
  const visionMission = data.visionMission;
  if (!visionMission || !getEl("visionText")) return;

  setText("visionText", visionMission.vision);
  setHTML(
    "missionList",
    (visionMission.missions || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")
  );
  setHTML(
    "valueList",
    (visionMission.values || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")
  );
}

function renderFeaturedInfo(items = []) {
  const container = getEl("featuredInfoList");
  if (!container) return;
  container.innerHTML = items
    .map(
      (item) => `
        <article class="featured-info-card">
          <div class="featured-info-media">
            <img src="${escapeHtml(safeUrl(item.image, PLACEHOLDER_IMAGE))}" data-fallback="${PLACEHOLDER_IMAGE}" alt="${escapeHtml(item.title)}" />
          </div>
          <div class="featured-info-body">
            <span class="featured-info-label"><i class="fa-solid ${escapeHtml(item.icon || "fa-circle-info")}"></i>${escapeHtml(
              item.label || "Informasi Sekolah"
            )}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <a class="text-link" href="${escapeHtml(safeUrl(item.url))}">
              <span>${escapeHtml(item.cta || "Buka halaman")}</span><i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPageBlock(block = {}, data = {}) {
  const items = block.items || [];
  return `
    <section class="content-block ${block.type === "serviceCards" ? "content-block-plain" : ""}">
      <div class="content-block-head">
        <h4>${escapeHtml(block.title)}</h4>
        ${block.badge ? `<span>${escapeHtml(block.badge)}</span>` : ""}
      </div>
      ${
        block.type === "steps"
          ? `<ol class="content-steps">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`
          : block.type === "timeline"
          ? `<div class="content-timeline">${items
              .map(
                (item) => `
                  <div class="timeline-item">
                    <strong>${escapeHtml(item.label)}</strong>
                    <span>${escapeHtml(item.text)}</span>
                  </div>
                `
              )
              .join("")}</div>`
          : block.type === "text"
          ? `<p class="content-text">${escapeHtml(block.text || "")}</p>`
          : block.type === "serviceCards"
          ? `<div class="service-link-grid">${items
              .map(
                (item) => `
                  <a class="service-link-card" href="${escapeHtml(safeUrl(item.url))}">
                    <i class="fa-solid ${escapeHtml(item.icon || "fa-circle-info")}"></i>
                    <span>
                      <strong>${escapeHtml(item.title)}</strong>
                      <small>${escapeHtml(item.description || "")}</small>
                      <em>${escapeHtml(item.cta || "Buka layanan")} <i class="fa-solid fa-arrow-right"></i></em>
                    </span>
                  </a>
                `
              )
              .join("")}</div>`
          : block.type === "downloads"
          ? `<div class="service-download-grid">${(data.sidebar?.downloads || [])
              .map(
                (item) => `
                  <a class="download-link download-link-large" href="${escapeHtml(safeUrl(item.url))}" download>
                    <span>${escapeHtml(item.type || "FILE")}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                    <i class="fa-solid fa-download"></i>
                  </a>
                `
              )
              .join("")}</div>`
          : `<ul class="content-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      }
    </section>
  `;
}

function renderInnerPage(data) {
  if (!getEl("pageContentBlocks") && !getEl("teacherDirectory")) return;
  const innerPage = data.innerPage || {};
  setText("innerPageKicker", innerPage.kicker || "Informasi Publik");
  setText("informasi-publik-title", innerPage.title || "Contoh Layout Halaman Dalam");
  setText("innerPageDescription", innerPage.description || "");
  setText("innerPageTitle", innerPage.contentTitle || "Direktori Guru dan Tenaga Kependidikan");
  setText("innerPageIntro", innerPage.contentIntro || "");

  setHTML(
    "pageHighlights",
    (innerPage.highlights || [])
      .map(
        (item) => `
          <article class="info-highlight-card">
            <i class="fa-solid ${escapeHtml(item.icon || "fa-circle-info")}"></i>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `
      )
      .join("")
  );

  const pageBlocks = (innerPage.blocks || []).map((block) => renderPageBlock(block, data)).join("");

  setHTML("pageContentBlocks", pageBlocks);

  const teachers = data.teachers || [];
  setText("teacherCount", `${teachers.length} data`);
  setHTML(
    "teacherDirectory",
    teachers
    .map(
      (teacher, index) => `
        <article class="teacher-card">
          <div class="teacher-photo">
            <img src="${escapeHtml(safeUrl(teacher.photo, PRINCIPAL_PLACEHOLDER))}" data-fallback="${PRINCIPAL_PLACEHOLDER}" alt="${escapeHtml(teacher.name)}" />
          </div>
          <dl class="teacher-data">
            <div><dt>Nama Lengkap</dt><dd>${String(index + 1).padStart(2, "0")}. ${escapeHtml(teacher.name)}</dd></div>
            <div><dt>NIK</dt><dd>${escapeHtml(teacher.nik)}</dd></div>
            <div><dt>Jenis Kelamin</dt><dd>${escapeHtml(teacher.gender)}</dd></div>
            <div><dt>Tempat Lahir</dt><dd>${escapeHtml(teacher.birthPlace)}</dd></div>
            <div><dt>Tanggal Lahir</dt><dd>${escapeHtml(teacher.birthDate)}</dd></div>
            <div><dt>Jenis GTK</dt><dd>${escapeHtml(teacher.position)}</dd></div>
          </dl>
        </article>
      `
    )
    .join("")
  );

  setHTML("sidebarQuickLinks", (data.sidebar?.quickLinks || [])
    .map(
      (link) => `
        <a class="sidebar-link" href="${escapeHtml(safeUrl(link.url))}">
          <i class="fa-solid ${escapeHtml(link.icon || "fa-link")}"></i>
          <span>${escapeHtml(link.title)}</span>
        </a>
      `
    )
    .join(""));

  setHTML("sidebarNewsList", (data.news || [])
    .slice(0, 4)
    .map(
      (item, index) => `
        <a class="sidebar-news" href="${newsDetailUrl(index)}">
          <span>${escapeHtml(item.date)}</span>
          <strong>${escapeHtml(item.title)}</strong>
        </a>
      `
    )
    .join(""));

  setHTML("sidebarDownloads", (data.sidebar?.downloads || [])
    .map(
      (item) => `
        <a class="download-link" href="${escapeHtml(safeUrl(item.url))}" download>
          <span>${escapeHtml(item.type || "FILE")}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <i class="fa-solid fa-download"></i>
        </a>
      `
    )
    .join(""));
}

function renderNews(news = []) {
  const container = getEl("newsList");
  if (!container) return;
  container.innerHTML = news
    .slice(0, 3)
    .map(
      (item, index) => `
        <article class="news-card">
          <div class="news-image">
            <img src="${escapeHtml(safeUrl(item.image, PLACEHOLDER_IMAGE))}" data-fallback="${PLACEHOLDER_IMAGE}" alt="${escapeHtml(item.title)}" />
            <span class="news-category">${escapeHtml(item.category)}</span>
          </div>
          <div class="news-body">
            <p class="news-date"><i class="fa-regular fa-calendar"></i> ${escapeHtml(item.date)}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.excerpt)}</p>
            <a class="text-link" href="${newsDetailUrl(index)}">
              <span>Baca selengkapnya</span><i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAgenda(agenda = []) {
  const container = getEl("agendaList");
  if (!container) return;
  container.innerHTML = agenda
    .map(
      (item) => `
        <article class="agenda-item">
          <div class="agenda-date">${escapeHtml(item.date)}<span>${escapeHtml(item.month)}</span></div>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <div class="agenda-meta">
              <span><i class="fa-regular fa-clock"></i>${escapeHtml(item.time)}</span>
              <span><i class="fa-solid fa-location-dot"></i>${escapeHtml(item.location)}</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAchievements(achievements = []) {
  const container = getEl("achievementList");
  if (!container) return;
  container.innerHTML = achievements
    .map(
      (item) => `
        <article class="achievement-card">
          <div class="achievement-image">
            <img src="${escapeHtml(safeUrl(item.image, PLACEHOLDER_IMAGE))}" data-fallback="${PLACEHOLDER_IMAGE}" alt="${escapeHtml(item.title)}" />
          </div>
          <div class="achievement-body">
            <div class="achievement-meta">
              <span>${escapeHtml(item.level)}</span>
              <span>${escapeHtml(item.year)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderStatistics(statistics = []) {
  const container = getEl("statisticsList");
  if (!container) return;
  container.innerHTML = statistics
    .map(
      (item) => `
        <div class="stat-card">
          <i class="fa-solid ${escapeHtml(item.icon || "fa-chart-simple")}"></i>
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </div>
      `
    )
    .join("");
}

function renderPrograms(programs = []) {
  const container = getEl("programList");
  if (!container) return;
  container.innerHTML = programs
    .map(
      (item) => `
        <article class="program-card">
          <i class="fa-solid ${escapeHtml(item.icon || "fa-star")}"></i>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join("");
}

function renderGallery(gallery = []) {
  const container = getEl("galleryList");
  if (!container) return;
  container.innerHTML = gallery
    .map(
      (item) => `
        <figure class="gallery-item">
          <img src="${escapeHtml(safeUrl(item.image, PLACEHOLDER_IMAGE))}" data-fallback="${PLACEHOLDER_IMAGE}" alt="${escapeHtml(item.caption)}" />
          <figcaption class="gallery-caption">${escapeHtml(item.caption)}</figcaption>
        </figure>
      `
    )
    .join("");
}

function renderTeacherDirectory(teachers = []) {
  const container = getEl("teacherDirectory");
  if (!container) return;
  const searchInput = getEl("teacherSearchInput");
  const positionFilter = getEl("teacherPositionFilter");
  const positions = [...new Set(teachers.map((teacher) => teacher.position).filter(Boolean))].sort();

  if (positionFilter && !positionFilter.dataset.ready) {
    positionFilter.innerHTML = `<option value="">Semua Jabatan</option>${positions
      .map((position) => `<option value="${escapeHtml(position)}">${escapeHtml(position)}</option>`)
      .join("")}`;
    positionFilter.dataset.ready = "true";
  }

  const render = () => {
    const keyword = String(searchInput?.value || "").toLowerCase().trim();
    const selectedPosition = positionFilter?.value || "";
    const filtered = teachers.filter((teacher) => {
      const haystack = [teacher.name, teacher.nik, teacher.gender, teacher.birthPlace, teacher.birthDate, teacher.position]
        .join(" ")
        .toLowerCase();
      const matchesKeyword = !keyword || haystack.includes(keyword);
      const matchesPosition = !selectedPosition || teacher.position === selectedPosition;
      return matchesKeyword && matchesPosition;
    });

    setText("teacherCount", `${filtered.length} dari ${teachers.length} data`);
    container.innerHTML = filtered.length
      ? filtered
          .map(
            (teacher, index) => `
              <article class="teacher-card">
                <div class="teacher-photo">
                  <img src="${escapeHtml(safeUrl(teacher.photo, PRINCIPAL_PLACEHOLDER))}" data-fallback="${PRINCIPAL_PLACEHOLDER}" alt="${escapeHtml(teacher.name)}" />
                </div>
                <dl class="teacher-data">
                  <div><dt>Nama Lengkap</dt><dd>${String(index + 1).padStart(2, "0")}. ${escapeHtml(teacher.name)}</dd></div>
                  <div><dt>NIK</dt><dd>${escapeHtml(teacher.nik)}</dd></div>
                  <div><dt>Jenis Kelamin</dt><dd>${escapeHtml(teacher.gender)}</dd></div>
                  <div><dt>Tempat Lahir</dt><dd>${escapeHtml(teacher.birthPlace)}</dd></div>
                  <div><dt>Tanggal Lahir</dt><dd>${escapeHtml(teacher.birthDate)}</dd></div>
                  <div><dt>Jenis GTK</dt><dd>${escapeHtml(teacher.position)}</dd></div>
                </dl>
              </article>
            `
          )
          .join("")
      : `<div class="empty-state">Data GTK tidak ditemukan. Coba kata kunci atau filter lain.</div>`;
    attachImageFallbacks(container);
  };

  searchInput?.addEventListener("input", render);
  positionFilter?.addEventListener("change", render);
  render();
}

function renderNewsDetail(data = {}) {
  const container = getEl("newsDetail");
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const index = Number(params.get("id") || 0);
  const news = data.news || [];
  const item = news[index] || news[0];
  if (!item) {
    container.innerHTML = `
      <article class="content-panel news-detail-panel">
        <p class="content-label">Berita</p>
        <h1>Berita belum tersedia</h1>
        <p>Informasi berita akan ditampilkan setelah tersedia dari sekolah.</p>
        <a class="button button-accent" href="berita.html">Kembali ke daftar berita</a>
      </article>
    `;
    return;
  }

  document.title = `${item.title} | ${data.schoolName || "Website Sekolah"}`;
  container.innerHTML = `
    <article class="content-panel news-detail-panel">
      <div class="news-detail-image">
        <img src="${escapeHtml(safeUrl(item.image, PLACEHOLDER_IMAGE))}" data-fallback="${PLACEHOLDER_IMAGE}" alt="${escapeHtml(item.title)}" />
        <span>${escapeHtml(item.category || "Berita")}</span>
      </div>
      <div class="news-detail-body">
        <p class="news-date"><i class="fa-regular fa-calendar"></i> ${escapeHtml(item.date || "")}</p>
        <h1>${escapeHtml(item.title)}</h1>
        ${(item.content || item.excerpt || "")
          .split("\n")
          .filter(Boolean)
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join("")}
        <div class="page-entry-links">
          <a class="button button-accent" href="berita.html">Kembali ke Berita</a>
          <a class="button button-outline" href="index.html#berita">Berita di Beranda</a>
        </div>
      </div>
    </article>
  `;
}

function extractIframeSrc(value = "") {
  const match = String(value).match(/src=["']([^"']+)["']/i);
  return match ? match[1] : value;
}

function cleanMapUrl(value = "") {
  return extractIframeSrc(value)
    .trim()
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&");
}

function isEmbeddableMapUrl(url = "") {
  return /google\.[^/]+\/maps\/embed/i.test(url) || /[?&]output=embed/i.test(url);
}

function extractMapCoordinates(url = "") {
  const value = String(url);
  const placeMatch = value.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (placeMatch) return placeMatch[1] + "," + placeMatch[2];

  const atMatch = value.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) return atMatch[1] + "," + atMatch[2];

  return "";
}

function buildMapQuery(location = "", schoolName = "") {
  const query = String(location).trim();
  const name = String(schoolName).trim();
  if (!query) return "";
  return name && !query.toLowerCase().includes(name.toLowerCase()) ? name + ", " + query : query;
}

function buildAddressMapUrl(location = "", schoolName = "") {
  const coordinates = extractMapCoordinates(location);
  if (coordinates) return "https://www.google.com/maps?q=" + encodeURIComponent(coordinates) + "&z=17&output=embed";

  const query = buildMapQuery(location, schoolName);
  return query ? "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed" : "";
}

function buildExternalMapUrl(mapUrl = "", address = "", schoolName = "") {
  if (mapUrl && mapUrl.startsWith("https://")) return mapUrl;
  const query = buildMapQuery(mapUrl || address, schoolName);
  return query ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query) : "#kontak";
}

function renderMap(data = {}) {
  const container = getEl("mapContainer");
  if (!container) return;

  const rawMapUrl = cleanMapUrl(data.mapEmbedUrl || "");
  const directEmbedUrl = rawMapUrl.startsWith("https://") && isEmbeddableMapUrl(rawMapUrl) ? rawMapUrl : "";
  const googleMapUrl = rawMapUrl.startsWith("https://") ? rawMapUrl : "";
  const typedLocation = rawMapUrl && !rawMapUrl.startsWith("https://") ? rawMapUrl : "";
  const embedUrl = directEmbedUrl || buildAddressMapUrl(googleMapUrl || typedLocation || data.address, data.schoolName);

  if (!embedUrl) return;

  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.title = "Peta lokasi sekolah";

  const externalUrl = buildExternalMapUrl(rawMapUrl, data.address, data.schoolName);
  const openLink = document.createElement("a");
  openLink.className = "map-open-link";
  openLink.href = externalUrl;
  openLink.target = "_blank";
  openLink.rel = "noopener";
  openLink.innerHTML = '<i class="fa-solid fa-location-dot"></i> Buka Google Maps';

  container.replaceChildren(iframe, openLink);
}

function createHeroSlider(images = []) {
  const hero = document.querySelector(".hero");
  const slidesContainer = getEl("heroSlides");
  const dotsContainer = getEl("sliderDots");
  if (!slidesContainer || !dotsContainer) return;
  const imageList = images.length ? images : [PLACEHOLDER_IMAGE];
  let activeIndex = 0;
  let timer;

  slidesContainer.innerHTML = imageList
    .map(
      (image, index) =>
        `<div class="hero-slide${index === 0 ? " active" : ""}" data-image="${escapeHtml(
          safeUrl(image, PLACEHOLDER_IMAGE)
        )}"></div>`
    )
    .join("");

  dotsContainer.innerHTML = imageList
    .map(
      (_, index) =>
        `<button class="slider-dot${index === 0 ? " active" : ""}" type="button" aria-label="Tampilkan slide ${index + 1}" data-slide="${index}"></button>`
    )
    .join("");

  const slides = [...slidesContainer.children];
  const dots = [...dotsContainer.children];

  slides.forEach((slide) => {
    const imageUrl = slide.dataset.image;
    const preload = new Image();
    preload.onload = () => {
      slide.style.backgroundImage = `url("${imageUrl.replaceAll('"', '\\"')}")`;
    };
    preload.onerror = () => slide.classList.add("image-failed");
    preload.src = imageUrl;
  });

  const updateHeroTextState = () => {
    const showText = activeIndex < 2;
    const heroContent = hero?.querySelector(".hero-content");
    hero?.classList.toggle("hero-text-hidden", !showText);
    hero?.classList.toggle("hero-photo-only", !showText);
    if (heroContent) {
      heroContent.dataset.visible = showText ? "true" : "false";
      heroContent.setAttribute("aria-hidden", showText ? "false" : "true");
    }
  };

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === activeIndex));
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
    updateHeroTextState();
  };

  const startTimer = () => {
    window.clearInterval(timer);
    if (slides.length > 1) timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
  };

  document.querySelector(".slider-prev").addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startTimer();
  });
  document.querySelector(".slider-next").addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startTimer();
  });
  dots.forEach((dot) =>
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slide));
      startTimer();
    })
  );

  if (slides.length === 1) {
    document.querySelectorAll(".slider-control, .slider-dots").forEach((element) => {
      element.hidden = true;
    });
  }

  updateHeroTextState();
  startTimer();
}

function setupNavigation() {
  const button = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (!button || !navigation) return;
  const icon = button.querySelector("i");

  const closeMenu = () => {
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
    icon.className = "fa-solid fa-bars";
  };

  button.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  navigation.querySelectorAll(".nav-dropdown-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const dropdown = toggle.closest(".nav-dropdown");
      const isOpen = dropdown.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) closeMenu();
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
    },
    { rootMargin: "-20% 0px -65%", threshold: [0.05, 0.25, 0.5] }
  );
  sections.forEach((section) => observer.observe(section));
}

async function loadSchool() {
  try {
    const response = await fetch("data/school.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    document.title = `${data.schoolName || "Website Sekolah"} | Website Resmi`;
    renderSharedChrome(data);
    setupNavigation();
    renderText(data);
    renderLinks(data);
    renderImages(data);
    renderServices(data.services);
    renderVisionMission(data);
    renderFeaturedInfo(data.featuredInfo);
    renderInnerPage(data);
    renderNews(data.news);
    renderAgenda(data.agenda);
    renderAchievements(data.achievements);
    renderStatistics(data.statistics);
    renderPrograms(data.programs);
    renderGallery(data.gallery);
    renderNewsDetail(data);
    renderMap(data);
    createHeroSlider(data.heroImages);
    renderStandalonePage(data);
    enrichPageExperience();
    attachImageFallbacks();
  } catch (error) {
    console.error("Gagal memuat data sekolah:", error);
    renderSharedChrome({});
    setupNavigation();
    document.getElementById("loadError").hidden = false;
    createHeroSlider([PLACEHOLDER_IMAGE]);
    renderStandalonePage({});
    enrichPageExperience();
    attachImageFallbacks();
  }
}

function renderStandalonePage(data = {}) {
  const pageKey = document.body.dataset.page;
  if (!pageKey) return;

  const page = data.pages?.[pageKey];
  if (!page) return;

  document.title = `${page.banner?.title || data.schoolName || "Website Sekolah"} | ${data.shortName || "Portal Sekolah"}`;
  setText("pageBannerKicker", page.banner?.kicker || "Informasi Sekolah");
  setText("pageBannerTitle", page.banner?.title || "");
  setText("pageBannerDescription", page.banner?.description || "");
  setHTML(
    "pageBannerActions",
    (page.banner?.actions || [])
      .map(
        (action) => `
          <a class="button ${escapeHtml(action.variant || "button-outline")}" href="${escapeHtml(
            safeUrl(action.url)
          )}">${escapeHtml(action.label)}</a>
        `
      )
      .join("")
  );

  setHTML(
    "pageContentBlocks",
    (page.blocks || []).map((block) => renderPageBlock(block, data)).join("")
  );

  setHTML(
    "pageHighlights",
    (page.highlights || [])
      .map(
        (item) => `
          <article class="info-highlight-card">
            <i class="fa-solid ${escapeHtml(item.icon || "fa-circle-info")}"></i>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `
      )
      .join("")
  );

  if (page.showFeatureCards) {
    const isPhotoGrid = page.galleryStyle === "photo-grid";
    const facilityStats =
      pageKey === "fasilitas" && page.facilityStats?.length
        ? `<div class="facility-stat-strip">${page.facilityStats
            .map(
              (item) => `
                <article class="facility-stat-card">
                  <i class="fa-solid ${escapeHtml(item.icon || "fa-building")}"></i>
                  <strong>${escapeHtml(item.value)}</strong>
                  <span>${escapeHtml(item.label)}</span>
                </article>
              `
            )
            .join("")}</div>`
        : "";
    setHTML(
      "pageDynamicContent",
      `${facilityStats}<div class="${isPhotoGrid ? "facility-photo-grid" : "feature-card-grid"}">${(page.featureCards || [])
        .map(
          (item) =>
            isPhotoGrid
              ? `
                <article class="facility-photo-card ${escapeHtml(item.positionClass || "")}" style="background-image: url('${escapeHtml(
                  safeUrl(item.image, PLACEHOLDER_IMAGE)
                )}')">
                  <div class="facility-photo-caption">
                    <span>${escapeHtml(item.label || "Fasilitas Sekolah")}</span>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                  </div>
                </article>
              `
              : `
                <article class="feature-card">
                  <div class="feature-card-image">
                    <img src="${escapeHtml(safeUrl(item.image, PLACEHOLDER_IMAGE))}" data-fallback="${PLACEHOLDER_IMAGE}" alt="${escapeHtml(item.title)}" />
                  </div>
                  <div class="feature-card-body">
                    <span class="feature-card-label">${escapeHtml(item.label || "Sorotan")}</span>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                    ${
                      item.items?.length
                        ? `<ul class="feature-card-list">${item.items.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>`
                        : ""
                    }
                  </div>
                </article>
              `
        )
        .join("")}</div>`
    );
  }

  if (page.showTeachers) {
    const teachers = data.teachers || [];
    renderTeacherDirectory(teachers);
  }

  if (page.showNews) {
    setHTML(
      "pageDynamicContent",
      `<div class="news-grid page-news-grid">${(data.news || [])
        .map(
          (item, index) => `
            <article class="news-card">
              <div class="news-image">
                <img src="${escapeHtml(safeUrl(item.image, PLACEHOLDER_IMAGE))}" data-fallback="${PLACEHOLDER_IMAGE}" alt="${escapeHtml(item.title)}" />
                <span class="news-category">${escapeHtml(item.category)}</span>
              </div>
              <div class="news-body">
                <p class="news-date"><i class="fa-regular fa-calendar"></i> ${escapeHtml(item.date)}</p>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.excerpt)}</p>
                <a class="text-link" href="${newsDetailUrl(index)}">
                  <span>Baca selengkapnya</span><i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </article>
          `
        )
        .join("")}</div>`
    );
  }

  if (page.showGallery) {
    setHTML(
      "pageDynamicContent",
      `<div class="gallery-grid page-gallery-grid">${(data.gallery || [])
        .map(
          (item) => `
            <figure class="gallery-item">
              <img src="${escapeHtml(safeUrl(item.image, PLACEHOLDER_IMAGE))}" data-fallback="${PLACEHOLDER_IMAGE}" alt="${escapeHtml(item.caption)}" />
              <figcaption class="gallery-caption">${escapeHtml(item.caption)}</figcaption>
            </figure>
          `
        )
        .join("")}</div>`
    );
  }
}

const currentYear = document.getElementById("currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();
loadSchool();

document.getElementById("siteSearchForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.getElementById("siteSearch").value.trim();
  if (!query) return;
  window.alert(`Fitur pencarian untuk "${query}" siap disambungkan ke halaman arsip pada tahap berikutnya.`);
});
