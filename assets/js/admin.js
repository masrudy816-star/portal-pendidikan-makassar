const ADMIN_PASSWORD = "admin123";
const TECHNICIAN_PASSWORD = "teknisi123";
const JSON_PATH = "data/school.json";
const UPLOAD_DIR = ["assets", "img", "uploads"];
const SERVICE_PAGE_KEYS = ["e-learning", "e-rapor", "perpustakaan", "jadwal", "unduhan"];
const SERVICE_PAGE_LABELS = {
  "e-learning": "E-Learning",
  "e-rapor": "E-Rapor",
  perpustakaan: "Perpustakaan Digital",
  jadwal: "Jadwal Pelajaran",
  unduhan: "Unduh Dokumen",
};
const DEFAULT_FEATURED_INFO = [
  {
    label: "Profil Sekolah",
    title: "Sarana dan Prasarana",
    description: "Lihat ruang kelas, laboratorium, perpustakaan, lapangan, dan fasilitas penunjang belajar yang dimiliki sekolah.",
    icon: "fa-school-flag",
    image: "assets/img/fasilitas/fasilitas-source.png",
    url: "fasilitas.html",
    cta: "Lihat fasilitas",
  },
  {
    label: "Kesiswaan",
    title: "Ekstrakurikuler",
    description: "Kenali pilihan kegiatan siswa untuk minat, bakat, kepemimpinan, dan pembinaan karakter.",
    icon: "fa-people-group",
    image: "assets/img/ekstrakurikuler/ekstrakurikuler-source.png",
    url: "ekstrakurikuler.html",
    cta: "Lihat ekskul",
  },
];

let schoolData = null;
let projectDir = null;
let advancedUnlocked = false;
let serverApiAvailable = false;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const statusBox = $("#statusBox");

function setStatus(message, type = "info") {
  statusBox.textContent = message;
  statusBox.dataset.type = type;
}

function updateActiveAdminNav() {
  const currentHash = window.location.hash || "#identitas";
  $$(".admin-sidebar nav a").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === currentHash);
  });
}

function showSaveSuccess(detail = {}) {
  const time = new Date().toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const path = detail.path || "data/school.json";
  const backup = detail.backup || "data/school.backup.json";
  statusBox.dataset.type = "success";
  statusBox.innerHTML = `
    <strong>Perubahan berhasil disimpan ke website.</strong>
    <span>Waktu simpan: ${time}</span>
    <span>File data diperbarui: <code>${path}</code></span>
    <span>Backup otomatis tersedia di: <code>${backup}</code></span>
    <a href="index.html" target="_blank" rel="noopener">Lihat website sekarang</a>
  `;
}

async function detectServerApi() {
  try {
    const response = await fetch("/admin/status", { cache: "no-store" });
    const data = await response.json();
    serverApiAvailable = Boolean(response.ok && data.ok);
  } catch {
    serverApiAvailable = false;
  }

  const chooseButton = $("#chooseFolderButton");
  if (chooseButton) {
    chooseButton.hidden = serverApiAvailable;
  }

  return serverApiAvailable;
}

function slugify(value) {
  return String(value || "file")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function bindField(field) {
  const input = document.querySelector(`[data-field="${field}"]`);
  if (!input) return;
  input.value = schoolData[field] || "";
  refreshImagePreviews(input.closest("label") || input.parentElement);
  input.oninput = null;
  input.addEventListener("input", () => {
    schoolData[field] = input.value;
    refreshImagePreviews(input.closest("label") || input.parentElement);
    renderCompleteness();
    syncJsonEditor();
  });
}

function getPathValue(object, path) {
  return path.split(".").reduce((current, key) => current?.[key], object);
}

function setPathValue(object, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((current, key) => {
    current[key] ||= {};
    return current[key];
  }, object);
  target[last] = value;
}

function bindNestedField(path) {
  const input = document.querySelector(`[data-nested-field="${path}"]`);
  if (!input) return;
  input.value = getPathValue(schoolData, path) || "";
  input.oninput = null;
  input.addEventListener("input", () => {
    setPathValue(schoolData, path, input.value);
    syncJsonEditor();
  });
}

function ensureDataShape() {
  schoolData.schoolId ||= slugify(schoolData.shortName || schoolData.schoolName || "sekolah-makassar");
  schoolData.npsn ||= "";
  schoolData.educationLevel ||= "";
  schoolData.district ||= "";
  schoolData.accreditation ||= "";
  schoolData.websiteStatus ||= "active";
  schoolData.admissionUrl ||= "ppdb.html";
  schoolData.mapEmbedUrl ||= "";
  schoolData.heroImages ||= [];
  schoolData.featuredInfo ||= [];
  schoolData.services ||= [];
  schoolData.visionMission ||= { vision: "", missions: [], values: [] };
  schoolData.visionMission.missions ||= [];
  schoolData.visionMission.values ||= [];
  schoolData.socialMedia ||= {};
  schoolData.socialMedia.instagram ||= "#";
  schoolData.socialMedia.facebook ||= "#";
  schoolData.socialMedia.youtube ||= "#";
  schoolData.socialMedia.tiktok ||= "#";
  schoolData.socialMedia.twitter ||= "#";
  schoolData.socialMedia.linkedin ||= "#";
  schoolData.news ||= [];
  schoolData.agenda ||= [];
  schoolData.achievements ||= [];
  schoolData.statistics ||= [];
  schoolData.programs ||= [];
  schoolData.teachers ||= [];
  schoolData.gallery ||= [];
  schoolData.sidebar ||= {};
  schoolData.sidebar.quickLinks ||= [];
  schoolData.sidebar.downloads ||= [];
  schoolData.pages ||= {};
  schoolData.pages.layanan ||= { blocks: [] };
  schoolData.pages.fasilitas ||= { featureCards: [] };
  schoolData.pages.ekstrakurikuler ||= { featureCards: [] };
  schoolData.pages.layanan.blocks ||= [];
  schoolData.pages.fasilitas.featureCards ||= [];
  schoolData.pages.fasilitas.facilityStats ||= [];
  schoolData.pages.ekstrakurikuler.featureCards ||= [];
  schoolData.privateReports ||= [];
  getServiceCardsBlock();
  SERVICE_PAGE_KEYS.forEach((key) => {
    schoolData.pages[key] ||= {
      banner: {
        kicker: "Layanan Sekolah",
        title: SERVICE_PAGE_LABELS[key],
        description: "Informasi layanan sekolah.",
        actions: [{ label: "Kembali ke Layanan", url: "layanan.html", variant: "button-accent" }],
      },
      highlights: [],
      blocks: [],
    };
    schoolData.pages[key].banner ||= {};
    schoolData.pages[key].banner.actions ||= [];
    schoolData.pages[key].highlights ||= [];
    schoolData.pages[key].blocks ||= [];
  });
}

function renderAll() {
  [
    "schoolName",
    "schoolId",
    "npsn",
    "educationLevel",
    "district",
    "accreditation",
    "websiteStatus",
    "shortName",
    "tagline",
    "address",
    "phone",
    "email",
    "whatsapp",
    "serviceHours",
    "admissionUrl",
    "mapEmbedUrl",
    "logo",
    "principalPhoto",
    "principalName",
    "principalPosition",
    "whatsappUrl",
    "principalMessage",
  ].forEach(bindField);
  ["socialMedia.instagram", "socialMedia.facebook", "socialMedia.youtube", "socialMedia.tiktok", "socialMedia.twitter", "socialMedia.linkedin"].forEach(bindNestedField);
  wireDirectUploads();
  renderHeroImages();
  renderFeaturedInfoAdmin();
  renderVisionMissionAdmin();
  renderServicesAdmin();
  renderServiceCardsAdmin();
  renderServicePagesAdmin();
  renderNews();
  renderAgenda();
  renderAchievements();
  renderStatisticsAdmin();
  renderPrograms();
  renderTeachers();
  renderGallery();
  renderFacilityStatsAdmin();
  renderFeatureCards("facility", schoolData.pages.fasilitas.featureCards, $("#facilityEditor"));
  renderFeatureCards("extra", schoolData.pages.ekstrakurikuler.featureCards, $("#extraEditor"));
  renderDownloads();
  renderQuickLinks();
  renderPrivateReports();
  renderCompleteness();
  syncJsonEditor();
}

function wireDirectUploads() {
  $$("[data-direct-upload]").forEach((input) => {
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const field = input.dataset.directUpload;
      const target = await saveUpload(file);
      if (!target) return;
      schoolData[field] = target;
      const targetInput = document.querySelector(`[data-field="${field}"]`);
      if (targetInput) targetInput.value = target;
      refreshImagePreviews(targetInput?.closest("label"));
      setStatus(`${field === "logo" ? "Logo sekolah" : "Foto kepala sekolah"} tersimpan: ${target}`);
      renderCompleteness();
      syncJsonEditor();
    };
  });
}

function card(title, body, onRemove) {
  const element = document.createElement("article");
  element.className = "repeat-card";
  element.innerHTML = `
    <div class="repeat-head">
      <strong>${title}</strong>
      <button class="danger-button" type="button">Hapus</button>
    </div>
    ${body}
  `;
  $("button", element).addEventListener("click", onRemove);
  return element;
}

function inputHTML(label, value, key, textarea = false) {
  const escaped = String(value || "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  return `<label>${label}${textarea ? `<textarea data-key="${key}" rows="3">${escaped}</textarea>` : `<input data-key="${key}" value="${escaped}" />`}</label>`;
}

function imageInputHTML(value) {
  const escaped = String(value || "").replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `
    <label class="wide">Path Gambar
      <div class="image-row">
        <input data-key="image" value="${escaped}" />
        <input data-upload type="file" accept="image/*" />
      </div>
      <div class="image-preview" data-preview-for="image"></div>
    </label>
  `;
}

function isImagePath(value = "") {
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(String(value).split("?")[0]);
}

function refreshImagePreviews(root = document) {
  if (!root) return;
  const previews = $$("[data-preview-for]", root);
  previews.forEach((preview) => {
    const key = preview.dataset.previewFor;
    const input = $(`[data-key="${key}"], [data-field="${key}"]`, root);
    const value = input?.value || "";
    if (!isImagePath(value)) {
      preview.classList.add("is-empty");
      preview.innerHTML = "<span>Preview gambar belum tersedia</span>";
      return;
    }
    preview.classList.remove("is-empty");
    preview.innerHTML = `<img src="${value}" alt="Preview gambar" />`;
  });
}

function wireInputs(root, item) {
  $$("[data-key]", root).forEach((input) => {
    input.addEventListener("input", () => {
      item[input.dataset.key] = input.value;
      refreshImagePreviews(root);
      renderCompleteness();
      syncJsonEditor();
    });
  });
  $$("[data-upload]", root).forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const target = await saveUpload(file);
      if (!target) return;
      item.image = target;
      if ("positionClass" in item) item.positionClass = "facility-position-full";
      const imagePath = $('[data-key="image"]', root);
      if (imagePath) imagePath.value = target;
      const positionInput = $('[data-key="positionClass"]', root);
      if (positionInput) positionInput.value = "facility-position-full";
      refreshImagePreviews(root);
      setStatus(`Foto tersimpan: ${target}`);
      renderCompleteness();
      syncJsonEditor();
    });
  });
}

function renderStringList(items, list, title, key = "value") {
  list.innerHTML = "";
  items.forEach((value, index) => {
    const item = { [key]: value };
    const element = card(
      `${title} ${index + 1}`,
      `<div class="repeat-grid">${imageInputHTML(value)}</div>`,
      () => {
        items.splice(index, 1);
        renderStringList(items, list, title, key);
        syncJsonEditor();
      }
    );
    const input = $('[data-key="image"]', element);
    input.value = value;
    input.addEventListener("input", () => {
      items[index] = input.value;
      refreshImagePreviews(element);
      syncJsonEditor();
    });
    $('[data-upload]', element).addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const target = await saveUpload(file);
      if (!target) return;
      items[index] = target;
      input.value = target;
      refreshImagePreviews(element);
      setStatus(`Foto tersimpan: ${target}`);
      renderCompleteness();
      syncJsonEditor();
    });
    refreshImagePreviews(element);
    list.appendChild(element);
  });
}

function renderHeroImages() {
  renderStringList(schoolData.heroImages, $("#heroEditor"), "Slide");
}

function renderFeaturedInfoAdmin() {
  const list = $("#featuredInfoEditor");
  if (!list) return;
  list.innerHTML = "";
  schoolData.featuredInfo.forEach((item, index) => {
    const element = card(
      `Kartu Beranda ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Label", item.label, "label")}
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Icon FontAwesome", item.icon, "icon")}
        ${inputHTML("URL Tujuan", item.url, "url")}
        ${inputHTML("Teks Tombol", item.cta, "cta")}
        ${imageInputHTML(item.image)}
        ${inputHTML("Deskripsi", item.description, "description", true)}
      </div>`,
      () => {
        schoolData.featuredInfo.splice(index, 1);
        renderFeaturedInfoAdmin();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    refreshImagePreviews(element);
    list.appendChild(element);
  });
}

function renderCompleteness() {
  if (!schoolData) return;
  const checks = [
    ["Metadata Multi Sekolah", schoolData.schoolId && schoolData.npsn && schoolData.educationLevel && schoolData.district],
    ["Identitas Sekolah", schoolData.schoolName && schoolData.address && schoolData.phone && schoolData.email],
    ["Logo dan Kepala Sekolah", schoolData.logo && schoolData.principalPhoto && schoolData.principalName && schoolData.principalMessage],
    ["Slider Utama", schoolData.heroImages?.length >= 1],
    ["Visi dan Misi", schoolData.visionMission?.vision && schoolData.visionMission?.missions?.length],
    ["Layanan Cepat", schoolData.services?.length >= 4],
    ["Halaman Layanan", getServiceCardsBlock().items?.length >= 4],
    ["Detail Layanan", SERVICE_PAGE_KEYS.every((key) => schoolData.pages?.[key]?.banner?.title && schoolData.pages?.[key]?.blocks?.length >= 1)],
    ["Berita", schoolData.news?.length >= 3],
    ["Agenda", schoolData.agenda?.length >= 1],
    ["Prestasi", schoolData.achievements?.length >= 1],
    ["Sekolah dalam Angka", schoolData.statistics?.length >= 4],
    ["Guru / GTK", schoolData.teachers?.length >= 3],
    ["Galeri", schoolData.gallery?.length >= 4],
    ["Fasilitas", schoolData.pages?.fasilitas?.featureCards?.length >= 3],
    ["Ekstrakurikuler", schoolData.pages?.ekstrakurikuler?.featureCards?.length >= 3],
    ["Link Penting", schoolData.sidebar?.quickLinks?.length >= 3],
    ["Unduhan", schoolData.sidebar?.downloads?.length >= 1],
  ];
  const complete = checks.filter(([, ok]) => Boolean(ok)).length;
  const score = Math.round((complete / checks.length) * 100);
  const scoreEl = $("#completionScore");
  const barEl = $("#completionBar");
  const listEl = $("#completionList");
  if (scoreEl) scoreEl.textContent = `${score}%`;
  if (barEl) barEl.style.width = `${score}%`;
  if (listEl) {
    listEl.innerHTML = checks
      .map(
        ([label, ok]) => `
          <article class="completion-item ${ok ? "is-complete" : "is-missing"}">
            <strong>${label}</strong>
            <span>${ok ? "Lengkap" : "Perlu dilengkapi"}</span>
          </article>
        `
      )
      .join("");
  }
}

function resetFeaturedCards() {
  schoolData.featuredInfo = DEFAULT_FEATURED_INFO.map((item) => ({ ...item }));
  renderFeaturedInfoAdmin();
  syncJsonEditor();
  setStatus("Kartu Beranda dikembalikan ke kolase bawaan. Klik Simpan Perubahan ke Website agar tampil di beranda.");
}

function renderVisionMissionAdmin() {
  $("#visionEditor").value = schoolData.visionMission.vision || "";
  $("#missionsEditor").value = (schoolData.visionMission.missions || []).join("\n");
  $("#valuesEditor").value = (schoolData.visionMission.values || []).join("\n");
  $("#visionEditor").oninput = () => {
    schoolData.visionMission.vision = $("#visionEditor").value;
    syncJsonEditor();
  };
  $("#missionsEditor").oninput = () => {
    schoolData.visionMission.missions = $("#missionsEditor").value.split("\n").map((item) => item.trim()).filter(Boolean);
    syncJsonEditor();
  };
  $("#valuesEditor").oninput = () => {
    schoolData.visionMission.values = $("#valuesEditor").value.split("\n").map((item) => item.trim()).filter(Boolean);
    syncJsonEditor();
  };
}

function renderServicesAdmin() {
  const list = $("#serviceEditor");
  list.innerHTML = "";
  schoolData.services.forEach((item, index) => {
    const element = card(
      `Layanan ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Icon FontAwesome", item.icon, "icon")}
        ${inputHTML("URL Tujuan", item.url, "url")}
      </div>`,
      () => {
        schoolData.services.splice(index, 1);
        renderServicesAdmin();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function getServiceCardsBlock() {
  schoolData.pages ||= {};
  schoolData.pages.layanan ||= { blocks: [] };
  schoolData.pages.layanan.blocks ||= [];
  let block = schoolData.pages.layanan.blocks.find((item) => item.type === "serviceCards");
  if (!block) {
    block = { title: "Daftar Layanan", type: "serviceCards", items: [] };
    schoolData.pages.layanan.blocks.unshift(block);
  }
  block.items ||= [];
  return block;
}

function renderServiceCardsAdmin() {
  const list = $("#serviceCardEditor");
  if (!list) return;
  const block = getServiceCardsBlock();
  list.innerHTML = "";
  block.items.forEach((item, index) => {
    const element = card(
      `Kartu Layanan ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Deskripsi", item.description, "description", true)}
        ${inputHTML("Icon FontAwesome", item.icon, "icon")}
        ${inputHTML("URL Tujuan", item.url, "url")}
        ${inputHTML("Teks Tombol", item.cta, "cta")}
      </div>`,
      () => {
        block.items.splice(index, 1);
        renderServiceCardsAdmin();
        renderCompleteness();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function encodeHighlights(items = []) {
  return items.map((item) => `${item.icon || ""} | ${item.title || ""} | ${item.description || ""}`).join("\n");
}

function decodeHighlights(value = "") {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon = "fa-circle-info", title = "Judul highlight", ...descriptionParts] = line.split("|").map((part) => part.trim());
      return { icon, title, description: descriptionParts.join(" | ") };
    });
}

function encodeBlocks(items = []) {
  return items
    .filter((block) => block.type !== "serviceCards")
    .map((block) => {
      const values = block.type === "text" ? [block.text || ""] : block.items || [];
      return `${block.title || "Judul Blok"} | ${block.type || "list"} | ${values.join("; ")}`;
    })
    .join("\n");
}

function decodeBlocks(value = "") {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "Judul Blok", type = "list", ...itemParts] = line.split("|").map((part) => part.trim());
      const text = itemParts.join(" | ");
      if (type === "downloads") return { title, type };
      if (type === "text") return { title, type, text };
      return {
        title,
        type,
        items: text.split(";").map((item) => item.trim()).filter(Boolean),
      };
    });
}

function renderServicePagesAdmin() {
  const list = $("#servicePageEditor");
  if (!list) return;
  list.innerHTML = "";
  SERVICE_PAGE_KEYS.forEach((key) => {
    const page = schoolData.pages[key];
    const firstAction = page.banner.actions[0] || {};
    const secondAction = page.banner.actions[1] || {};
    const element = card(
      SERVICE_PAGE_LABELS[key],
      `<div class="repeat-grid">
        ${inputHTML("Kicker", page.banner.kicker, "bannerKicker")}
        ${inputHTML("Judul Halaman", page.banner.title, "bannerTitle")}
        ${inputHTML("Deskripsi Banner", page.banner.description, "bannerDescription", true)}
        ${inputHTML("Tombol Utama - Label", firstAction.label, "action1Label")}
        ${inputHTML("Tombol Utama - URL", firstAction.url, "action1Url")}
        ${inputHTML("Tombol Kedua - Label", secondAction.label, "action2Label")}
        ${inputHTML("Tombol Kedua - URL", secondAction.url, "action2Url")}
        <label class="wide">Highlight Halaman <small>Satu baris: icon | judul | deskripsi</small><textarea data-service-key="highlights" rows="5">${encodeHighlights(page.highlights)}</textarea></label>
        <label class="wide">Blok Konten <small>Satu baris: Judul Blok | list/steps/text/downloads | item 1; item 2</small><textarea data-service-key="blocks" rows="6">${encodeBlocks(page.blocks)}</textarea></label>
      </div>`,
      () => {
        if (!confirm(`Kosongkan isi halaman ${SERVICE_PAGE_LABELS[key]}?`)) return;
        page.highlights = [];
        page.blocks = [];
        renderServicePagesAdmin();
        renderCompleteness();
        syncJsonEditor();
      }
    );

    $$("[data-key]", element).forEach((input) => {
      input.addEventListener("input", () => {
        const value = input.value;
        if (input.dataset.key === "bannerKicker") page.banner.kicker = value;
        if (input.dataset.key === "bannerTitle") page.banner.title = value;
        if (input.dataset.key === "bannerDescription") page.banner.description = value;
        if (input.dataset.key === "action1Label") {
          page.banner.actions[0] ||= { variant: "button-accent" };
          page.banner.actions[0].label = value;
        }
        if (input.dataset.key === "action1Url") {
          page.banner.actions[0] ||= { variant: "button-accent" };
          page.banner.actions[0].url = value;
          page.banner.actions[0].variant ||= "button-accent";
        }
        if (input.dataset.key === "action2Label") {
          page.banner.actions[1] ||= { variant: "button-outline" };
          page.banner.actions[1].label = value;
        }
        if (input.dataset.key === "action2Url") {
          page.banner.actions[1] ||= { variant: "button-outline" };
          page.banner.actions[1].url = value;
          page.banner.actions[1].variant ||= "button-outline";
        }
        renderCompleteness();
        syncJsonEditor();
      });
    });

    $$("[data-service-key]", element).forEach((input) => {
      input.addEventListener("input", () => {
        if (input.dataset.serviceKey === "highlights") page.highlights = decodeHighlights(input.value);
        if (input.dataset.serviceKey === "blocks") page.blocks = decodeBlocks(input.value);
        renderCompleteness();
        syncJsonEditor();
      });
    });

    list.appendChild(element);
  });
}

function renderNews() {
  const list = $("#newsEditor");
  list.innerHTML = "";
  schoolData.news.forEach((item, index) => {
    const element = card(
      `Berita ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Tanggal", item.date, "date")}
        ${inputHTML("Kategori", item.category, "category")}
        ${inputHTML("URL Tujuan", item.url, "url")}
        ${imageInputHTML(item.image)}
        ${inputHTML("Ringkasan", item.excerpt, "excerpt", true)}
        ${inputHTML("Isi Berita Lengkap", item.content, "content", true)}
      </div>`,
      () => {
        schoolData.news.splice(index, 1);
        renderNews();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderGallery() {
  const list = $("#galleryEditor");
  list.innerHTML = "";
  schoolData.gallery.forEach((item, index) => {
    const element = card(
      `Foto Galeri ${index + 1}`,
      `<div class="repeat-grid">
        ${imageInputHTML(item.image)}
        ${inputHTML("Caption", item.caption, "caption")}
      </div>`,
      () => {
        schoolData.gallery.splice(index, 1);
        renderGallery();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderFeatureCards(type, items, list) {
  list.innerHTML = "";
  items.forEach((item, index) => {
    const element = card(
      `${type === "facility" ? "Fasilitas" : "Ekskul"} ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Label", item.label, "label")}
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Posisi Foto", item.positionClass, "positionClass")}
        ${imageInputHTML(item.image)}
        ${inputHTML("Penjelasan", item.description, "description", true)}
      </div>`,
      () => {
        items.splice(index, 1);
        renderFeatureCards(type, items, list);
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderDownloads() {
  const list = $("#downloadEditor");
  list.innerHTML = "";
  schoolData.sidebar.downloads.forEach((item, index) => {
    const element = card(
      `Dokumen ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Tipe", item.type, "type")}
        <label class="wide">Path File
          <div class="image-row">
            <input data-key="url" value="${String(item.url || "").replaceAll('"', "&quot;")}" />
            <input data-doc-upload type="file" />
          </div>
        </label>
      </div>`,
      () => {
        schoolData.sidebar.downloads.splice(index, 1);
        renderDownloads();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    $("[data-doc-upload]", element).addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const target = await saveUpload(file, ["assets", "docs"]);
      if (!target) return;
      item.url = target;
      $('[data-key="url"]', element).value = target;
      setStatus(`Dokumen tersimpan: ${target}`);
      syncJsonEditor();
    });
    list.appendChild(element);
  });
}

function renderQuickLinks() {
  const list = $("#quickLinkEditor");
  if (!list) return;
  list.innerHTML = "";
  schoolData.sidebar.quickLinks.forEach((item, index) => {
    const element = card(
      `Link Penting ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Icon FontAwesome", item.icon, "icon")}
        ${inputHTML("URL Tujuan", item.url, "url")}
      </div>`,
      () => {
        schoolData.sidebar.quickLinks.splice(index, 1);
        renderQuickLinks();
        renderCompleteness();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderAgenda() {
  const list = $("#agendaEditor");
  list.innerHTML = "";
  schoolData.agenda.forEach((item, index) => {
    const element = card(
      `Agenda ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Tanggal", item.date, "date")}
        ${inputHTML("Bulan", item.month, "month")}
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Waktu", item.time, "time")}
        ${inputHTML("Lokasi", item.location, "location")}
      </div>`,
      () => {
        schoolData.agenda.splice(index, 1);
        renderAgenda();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderAchievements() {
  const list = $("#achievementEditor");
  list.innerHTML = "";
  schoolData.achievements.forEach((item, index) => {
    const element = card(
      `Prestasi ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Tingkat", item.level, "level")}
        ${inputHTML("Tahun", item.year, "year")}
        ${imageInputHTML(item.image)}
        ${inputHTML("Deskripsi", item.description, "description", true)}
      </div>`,
      () => {
        schoolData.achievements.splice(index, 1);
        renderAchievements();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderStatisticsAdmin() {
  const list = $("#statisticEditor");
  if (!list) return;
  list.innerHTML = "";
  schoolData.statistics.forEach((item, index) => {
    const element = card(
      `Angka Sekolah ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Label", item.label, "label")}
        ${inputHTML("Angka", item.value, "value")}
        ${inputHTML("Icon FontAwesome", item.icon, "icon")}
      </div>`,
      () => {
        schoolData.statistics.splice(index, 1);
        renderStatisticsAdmin();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderFacilityStatsAdmin() {
  const list = $("#facilityStatEditor");
  if (!list) return;
  const items = schoolData.pages.fasilitas.facilityStats || [];
  list.innerHTML = "";
  items.forEach((item, index) => {
    const element = card(
      `Angka Fasilitas ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Nama Fasilitas", item.label, "label")}
        ${inputHTML("Jumlah", item.value, "value")}
        ${inputHTML("Icon FontAwesome", item.icon, "icon")}
      </div>`,
      () => {
        items.splice(index, 1);
        renderFacilityStatsAdmin();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderPrograms() {
  const list = $("#programEditor");
  list.innerHTML = "";
  schoolData.programs.forEach((item, index) => {
    const element = card(
      `Program ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Judul", item.title, "title")}
        ${inputHTML("Icon FontAwesome", item.icon, "icon")}
        ${inputHTML("Deskripsi", item.description, "description", true)}
      </div>`,
      () => {
        schoolData.programs.splice(index, 1);
        renderPrograms();
        syncJsonEditor();
      }
    );
    wireInputs(element, item);
    list.appendChild(element);
  });
}

function renderTeachers() {
  const list = $("#teacherEditor");
  list.innerHTML = "";
  schoolData.teachers.forEach((item, index) => {
    const element = card(
      `GTK ${index + 1}`,
      `<div class="repeat-grid">
        ${inputHTML("Nama Lengkap", item.name, "name")}
        ${inputHTML("NIK", item.nik, "nik")}
        ${inputHTML("Jenis Kelamin", item.gender, "gender")}
        ${inputHTML("Tempat Lahir", item.birthPlace, "birthPlace")}
        ${inputHTML("Tanggal Lahir", item.birthDate, "birthDate")}
        ${inputHTML("Jabatan", item.position, "position")}
        ${imageInputHTML(item.photo || item.image)}
      </div>`,
      () => {
        schoolData.teachers.splice(index, 1);
        renderTeachers();
        syncJsonEditor();
      }
    );
    $$("[data-key]", element).forEach((input) => {
      input.addEventListener("input", () => {
        if (input.dataset.key === "image") item.photo = input.value;
        else item[input.dataset.key] = input.value;
        syncJsonEditor();
      });
    });
    $('[data-upload]', element).addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const target = await saveUpload(file);
      if (!target) return;
      item.photo = target;
      $('[data-key="image"]', element).value = target;
      refreshImagePreviews(element);
      setStatus(`Foto GTK tersimpan: ${target}`);
      renderCompleteness();
      syncJsonEditor();
    });
    refreshImagePreviews(element);
    list.appendChild(element);
  });
}



function createBlankPrivateReport() {
  return {
    id: "report-" + Date.now(),
    reportDate: new Date().toISOString().slice(0, 10),
    reportedBy: "Operator Sekolah",
    category: "Sarana Prasarana",
    itemName: "",
    total: "",
    good: "",
    minorDamage: "",
    unusable: "",
    urgency: "sedang",
    status: "draft",
    evidenceImage: "",
    description: "",
  };
}

function reportFormBody(item) {
  const safeEvidence = String(item.evidenceImage || "").replaceAll("&", "&amp;").replaceAll("\"", "&quot;");
  return `<div class="repeat-grid">
    ${inputHTML("Tanggal Laporan", item.reportDate, "reportDate")}
    ${inputHTML("Pelapor / Operator", item.reportedBy, "reportedBy")}
    ${inputHTML("Kategori", item.category, "category")}
    ${inputHTML("Nama Item yang Dilaporkan", item.itemName, "itemName")}
    ${inputHTML("Jumlah Total", item.total, "total")}
    ${inputHTML("Kondisi Baik", item.good, "good")}
    ${inputHTML("Rusak Ringan", item.minorDamage, "minorDamage")}
    ${inputHTML("Tidak Layak Pakai", item.unusable, "unusable")}
    ${inputHTML("Urgensi", item.urgency, "urgency")}
    ${inputHTML("Status", item.status, "status")}
    <label class="wide">Foto Bukti
      <div class="image-row">
        <input data-key="evidenceImage" value="${safeEvidence}" />
        <input data-report-upload type="file" accept="image/*" />
      </div>
      <div class="image-preview" data-preview-for="evidenceImage"></div>
    </label>
    ${inputHTML("Catatan / Keterangan", item.description, "description", true)}
  </div>`;
}

function wireReportUpload(element, item) {
  const upload = $("[data-report-upload]", element);
  if (!upload) return;
  upload.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const target = await saveUpload(file, ["assets", "img", "reports"]);
    if (!target) return;
    item.evidenceImage = target;
    $("[data-key=\"evidenceImage\"]", element).value = target;
    refreshImagePreviews(element);
    setStatus("Foto bukti laporan tersimpan: " + target);
    renderPrivateReportSummary();
    syncJsonEditor();
  });
}

function openPrivateReportForm() {
  const panel = $("#privateReportFormPanel");
  if (!panel) return;
  const draft = createBlankPrivateReport();
  panel.hidden = false;
  panel.innerHTML = `<div class="repeat-head"><strong>Form Laporan Baru</strong><button class="ghost-button" type="button" data-cancel-report>Batalkan</button></div>${reportFormBody(draft)}<div class="top-actions inline-actions"><button class="primary-button" type="button" data-submit-report>Masukkan ke Daftar Laporan</button></div>`;
  wireInputs(panel, draft);
  wireReportUpload(panel, draft);
  refreshImagePreviews(panel);
  $("[data-cancel-report]", panel).addEventListener("click", () => {
    panel.hidden = true;
    panel.innerHTML = "";
  });
  $("[data-submit-report]", panel).addEventListener("click", () => {
    if (!String(draft.itemName || "").trim()) {
      alert("Isi dulu nama item yang mau dilaporkan, misalnya Toilet, Ruang Kelas, atau Laboratorium.");
      return;
    }
    schoolData.privateReports.unshift({ ...draft });
    panel.hidden = true;
    panel.innerHTML = "";
    renderPrivateReports();
    syncJsonEditor();
    setStatus("Laporan baru sudah masuk daftar. Klik Simpan Perubahan ke Website agar tersimpan permanen.");
  });
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}
function reportMetric(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function renderPrivateReportSummary() {
  const summary = $("#privateReportSummary");
  if (!summary) return;
  const reports = schoolData.privateReports || [];
  const total = reports.length;
  const urgent = reports.filter((item) => ["tinggi", "darurat"].includes(String(item.urgency || "").toLowerCase())).length;
  const submitted = reports.filter((item) => ["dikirim", "submitted", "ditinjau", "reviewed"].includes(String(item.status || "").toLowerCase())).length;
  const proofs = reports.filter((item) => item.evidenceImage).length;
  summary.innerHTML = [
    "<article><strong>" + total + "</strong><span>Total laporan</span></article>",
    "<article><strong>" + urgent + "</strong><span>Prioritas tinggi/darurat</span></article>",
    "<article><strong>" + submitted + "</strong><span>Dikirim/ditinjau</span></article>",
    "<article><strong>" + proofs + "</strong><span>Dengan bukti foto</span></article>"
  ].join("");
}

function renderPrivateReports() {
  const list = $("#privateReportEditor");
  if (!list) return;
  schoolData.privateReports ||= [];
  renderPrivateReportSummary();
  list.innerHTML = "";
  if (!schoolData.privateReports.length) {
    list.innerHTML = '<div class="advanced-lock"><strong>Belum ada laporan.</strong><span>Klik Tambah Laporan untuk mengisi laporan privat sekolah kepada dinas.</span></div>';
    return;
  }
  schoolData.privateReports.forEach((item, index) => {
    item.id ||= "report-" + Date.now() + "-" + (index + 1);
    item.reportDate ||= new Date().toISOString().slice(0, 10);
    item.status ||= "draft";
    item.urgency ||= "sedang";
    item.category ||= "Sarana Prasarana";
    const total = reportMetric(item.total);
    const checked = reportMetric(item.good) + reportMetric(item.minorDamage) + reportMetric(item.unusable);
    const body = `
      <div class="report-card-meta">
        <span class="report-badge">${escapeHtml(item.status || "draft")}</span>
        <span class="report-badge report-urgency">${escapeHtml(item.urgency || "sedang")}</span>
        <span>${checked}/${total || 0} unit tercatat</span>
      </div>
      ${reportFormBody(item)}
    `;
    const element = card("Laporan " + (index + 1) + " - " + (item.itemName || "Item sekolah"), body, () => {
      schoolData.privateReports.splice(index, 1);
      renderPrivateReports();
      syncJsonEditor();
    });
    wireInputs(element, item);
    $("[data-key]", element).forEach((input) => input.addEventListener("input", renderPrivateReportSummary));
    $("[data-report-upload]", element).addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const target = await saveUpload(file, ["assets", "img", "reports"]);
      if (!target) return;
      item.evidenceImage = target;
      $("[data-key=\"evidenceImage\"]", element).value = target;
      refreshImagePreviews(element);
      setStatus("Foto bukti laporan tersimpan: " + target);
      renderPrivateReportSummary();
      syncJsonEditor();
    });
    refreshImagePreviews(element);
    list.appendChild(element);
  });
}
function syncJsonEditor() {
  const editor = $("#jsonEditor");
  if (editor && advancedUnlocked) editor.value = JSON.stringify(schoolData, null, 2);
}

function applyJsonEditor() {
  if (!advancedUnlocked) return;
  try {
    schoolData = JSON.parse($("#jsonEditor").value);
    ensureDataShape();
    renderAll();
    setStatus("JSON lanjutan berhasil diterapkan ke form.");
  } catch (error) {
    setStatus(`JSON tidak valid: ${error.message}`, "error");
  }
}

function unlockJsonEditor() {
  const code = prompt("Masukkan kode teknisi untuk membuka Mode Lanjutan JSON:");
  if (code !== TECHNICIAN_PASSWORD) {
    setStatus("Kode teknisi salah. Mode lanjutan tetap terkunci.", "warning");
    return;
  }
  advancedUnlocked = true;
  $("#jsonLock").hidden = true;
  $("#jsonTools").hidden = false;
  syncJsonEditor();
  setStatus("Mode Lanjutan JSON terbuka. Gunakan hati-hati.");
}

async function getNestedDir(handle, parts) {
  let current = handle;
  for (const part of parts) {
    current = await current.getDirectoryHandle(part, { create: true });
  }
  return current;
}

async function saveUpload(file, dirParts = UPLOAD_DIR) {
  await detectServerApi();

  if (serverApiAvailable) {
    const response = await fetch("/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        targetType: dirParts.join("/") === "assets/docs" ? "docs" : "images",
        data: await fileToBase64(file),
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.message || "Upload file tidak berhasil.");
    }
    return result.path;
  }

  if (!projectDir) {
    const message = "Server admin lokal belum aktif. Jalankan `node server.js`, buka ulang http://127.0.0.1:8000/admin.html, lalu upload lagi. Pilih Folder Project hanya mode cadangan.";
    setStatus(message, "warning");
    alert(message);
    return "";
  }
  const folder = await getNestedDir(projectDir, dirParts);
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const name = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`;
  const fileHandle = await folder.getFileHandle(name, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(file);
  await writable.close();
  return `${dirParts.join("/")}/${name}`;
}

async function fileToBase64(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

async function chooseProjectFolder() {
  if (!window.showDirectoryPicker) {
    setStatus("Browser belum mendukung mode cadangan pilih folder. Jalankan panel lewat `node server.js` agar simpan langsung aktif.", "warning");
    return;
  }
  projectDir = await window.showDirectoryPicker({ mode: "readwrite" });
  setStatus("Folder project terhubung dalam mode cadangan. Sekarang upload foto/dokumen dan tombol simpan bisa mengubah data/school.json.");
}

async function saveJson() {
  const json = `${JSON.stringify(schoolData, null, 2)}\n`;
  await detectServerApi();

  if (serverApiAvailable) {
    const response = await fetch("/admin/save-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: schoolData }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.message || "Data belum berhasil disimpan.");
    }
    showSaveSuccess(result);
    return;
  }

  if (projectDir) {
    const dataDir = await getNestedDir(projectDir, ["data"]);
    await writeBackup(dataDir);
    const fileHandle = await dataDir.getFileHandle("school.json", { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(json);
    await writable.close();
    showSaveSuccess();
    return;
  }
  setStatus("Belum bisa menyimpan langsung karena server admin lokal belum aktif. Jalankan `node server.js`, lalu buka ulang halaman admin dari http://127.0.0.1:8000/admin.html.", "warning");
  alert("Belum bisa menyimpan langsung.\n\nTutup server Live Server/Python kalau masih berjalan, lalu jalankan:\nnode server.js\n\nSetelah itu buka ulang:\nhttp://127.0.0.1:8000/admin.html");
}

async function writeBackup(dataDir) {
  try {
    const backupHandle = await dataDir.getFileHandle("school.backup.json", { create: true });
    const writable = await backupHandle.createWritable();
    await writable.write(`${JSON.stringify(schoolData, null, 2)}\n`);
    await writable.close();
  } catch (error) {
    setStatus(`Backup tidak berhasil dibuat: ${error.message}`, "warning");
  }
}

async function loadData() {
  await detectServerApi();
  const response = await fetch(JSON_PATH, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  schoolData = await response.json();
  ensureDataShape();
  renderAll();
  if (serverApiAvailable) {
    setStatus("Mode server admin aktif. Perubahan bisa disimpan langsung ke website tanpa pilih folder project.");
  } else {
    setStatus("Data berhasil dimuat. Karena belum memakai server admin lokal, pilih folder project agar bisa menyimpan langsung.", "warning");
  }
}

function addItem(type) {
  const map = {
    hero: () => schoolData.heroImages.push("assets/img/hero-placeholder.svg"),
    featured: () => schoolData.featuredInfo.push({ label: "Informasi Sekolah", title: "Judul kartu", description: "Deskripsi singkat kartu beranda.", icon: "fa-circle-info", image: "assets/img/hero-placeholder.svg", url: "profil.html", cta: "Lihat detail" }),
    service: () => schoolData.services.push({ title: "Layanan Baru", icon: "fa-link", url: "layanan.html" }),
    "service-card": () => getServiceCardsBlock().items.push({ title: "Layanan Baru", description: "Deskripsi layanan sekolah.", icon: "fa-link", url: "layanan.html", cta: "Buka layanan" }),
    news: () => schoolData.news.push({ title: "Judul berita baru", date: "Tanggal", category: "Kegiatan", image: "assets/img/hero-placeholder.svg", excerpt: "Ringkasan berita.", content: "Isi lengkap berita bisa ditulis di sini.", url: "detail-berita.html" }),
    agenda: () => schoolData.agenda.push({ date: "01", month: "JAN", title: "Agenda baru", time: "07.30 WITA", location: "Sekolah" }),
    achievement: () => schoolData.achievements.push({ title: "Prestasi baru", level: "Tingkat", year: new Date().getFullYear().toString(), image: "assets/img/hero-placeholder.svg", description: "Deskripsi prestasi." }),
    statistic: () => schoolData.statistics.push({ label: "Label angka", value: "0", icon: "fa-chart-simple" }),
    program: () => schoolData.programs.push({ title: "Program baru", icon: "fa-star", description: "Deskripsi program." }),
    teacher: () => schoolData.teachers.push({ name: "Nama GTK", nik: "**", gender: "-", birthPlace: "-", birthDate: "-", position: "Jabatan", photo: "assets/img/principal-placeholder.svg" }),
    gallery: () => schoolData.gallery.push({ image: "assets/img/hero-placeholder.svg", caption: "Caption foto kegiatan" }),
    facility: () => schoolData.pages.fasilitas.featureCards.push({ label: "Fasilitas", title: "Nama fasilitas", description: "Penjelasan fasilitas.", image: "assets/img/fasilitas/fasilitas-source.png", positionClass: "facility-position-top-left" }),
    "facility-stat": () => schoolData.pages.fasilitas.facilityStats.push({ label: "Nama fasilitas", value: "1", icon: "fa-building" }),
    extra: () => schoolData.pages.ekstrakurikuler.featureCards.push({ label: "Ekskul", title: "Nama ekstrakurikuler", description: "Penjelasan kegiatan.", image: "assets/img/ekstrakurikuler/ekstrakurikuler-source.png", positionClass: "facility-position-top-left" }),
    "quick-link": () => schoolData.sidebar.quickLinks.push({ title: "Link Baru", icon: "fa-link", url: "layanan.html" }),
    download: () => schoolData.sidebar.downloads.push({ title: "Nama dokumen", type: "PDF", url: "assets/docs/nama-dokumen.pdf" }),
  };
  map[type]?.();
  renderAll();
  syncJsonEditor();
}

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if ($("#adminPassword").value !== ADMIN_PASSWORD) {
    alert("Kode admin salah.");
    return;
  }
  localStorage.setItem("schoolAdminLoggedIn", "true");
  $("#loginPanel").hidden = true;
  $("#dashboard").hidden = false;
  await loadData().catch((error) => setStatus(`Gagal memuat data: ${error.message}`, "error"));
});

$("#logoutButton").addEventListener("click", () => {
  localStorage.removeItem("schoolAdminLoggedIn");
  location.reload();
});

$("#chooseFolderButton").addEventListener("click", () => chooseProjectFolder().catch((error) => setStatus(error.message, "error")));
$("#saveButton").addEventListener("click", () => saveJson().catch((error) => setStatus(error.message, "error")));
$("#openReportFormButton")?.addEventListener("click", openPrivateReportForm);
$("#resetFeaturedCardsButton")?.addEventListener("click", resetFeaturedCards);
$("#refreshCompletenessButton")?.addEventListener("click", renderCompleteness);
$("#unlockJsonButton").addEventListener("click", unlockJsonEditor);
$("#refreshJsonButton")?.addEventListener("click", syncJsonEditor);
$("#applyJsonButton")?.addEventListener("click", applyJsonEditor);
$$("[data-add]").forEach((button) => button.addEventListener("click", () => addItem(button.dataset.add)));
window.addEventListener("hashchange", updateActiveAdminNav);
updateActiveAdminNav();

if (localStorage.getItem("schoolAdminLoggedIn") === "true") {
  $("#loginPanel").hidden = true;
  $("#dashboard").hidden = false;
  loadData().catch((error) => setStatus(`Gagal memuat data: ${error.message}`, "error"));
}
