const page = document.body.dataset.page || "dashboard";

const navItems = [
  ["dashboard", "dashboard.html", "fa-chart-pie", "Dashboard"],
  ["sekolah", "sekolah.html", "fa-school", "Daftar Sekolah"],
  ["website", "website.html", "fa-globe", "Website Sekolah"],
  ["konten", "konten.html", "fa-file-lines", "Konten & Informasi"],
  ["sarpras", "sarpras.html", "fa-building", "Sarana & Prasarana"],
  ["pelaporan-privat", "pelaporan-privat.html", "fa-lock", "Pelaporan Privat"],
  ["berita", "berita.html", "fa-calendar-days", "Berita & Kegiatan"],
  ["galeri", "galeri.html", "fa-images", "Galeri"],
  ["laporan", "laporan.html", "fa-chart-line", "Statistik & Laporan"],
  ["pengguna", "pengguna.html", "fa-users-gear", "Pengguna"],
  ["pengaturan", "pengaturan.html", "fa-gear", "Pengaturan"],
  ["logout", "login.html", "fa-right-from-bracket", "Keluar"]
];

const contentLabels = {
  profil: "Profil",
  visiMisi: "Visi Misi",
  sejarah: "Sejarah",
  fasilitas: "Fasilitas",
  ekstrakurikuler: "Ekskul",
  gtk: "GTK",
  berita: "Berita",
  galeri: "Galeri",
  ppdb: "PPDB/SPMB",
  spp: "SPP",
  layanan: "Layanan",
  unduhan: "Unduhan",
  kontak: "Kontak"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const fmt = (number) => Number(number || 0).toLocaleString("id-ID");
const avg = (items) => items.length ? Math.round(items.reduce((sum, value) => sum + Number(value || 0), 0) / items.length) : 0;
const localSchoolsKey = "dinasAdditionalSchools";
const appSettingsKey = "dinasAppSettings";
const privateReportActionsKey = "dinasPrivateReportActions";
const defaultSettings = {
  systemName: "Sistem Monitoring Website Sekolah",
  agencyName: "Dinas Pendidikan",
  agencyRegion: "Kota Makassar",
  logoUrl: "",
  adminPhotoUrl: "https://i.pravatar.cc/80?img=12",
  adminName: "Admin Dinas",
  adminEmail: "admin@disdik.makassar.go.id",
  timezone: "WITA - Makassar",
  activeYear: "2026",
  reportFrequency: "Mingguan",
  lowContentLimit: "70%",
  activeWebsiteTarget: "95%"
};

function requireLogin() {
  if (page !== "login" && localStorage.getItem("dinasLoggedIn") !== "true") {
    location.href = "login.html";
  }
}

function renderShell() {
  const settings = getAppSettings();
  const todayLabel = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Makassar"
  }).format(new Date());
  const sidebar = $("#dinasSidebar");
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-brand">
        ${logoMarkup(settings.logoUrl, settings.agencyName, "sidebar-logo")}
        <div><strong>${settings.agencyName}</strong><small>${settings.agencyRegion}</small></div>
      </div>
      <nav>${navItems.map(([key, href, icon, label]) => `<a class="${page === key ? "active" : ""}" href="${href}" data-nav="${key}"><i class="fa-solid ${icon}"></i>${label}</a>`).join("")}</nav>
      <div class="sidebar-action">
        <a href="website.html#input-website"><i class="fa-solid fa-plus"></i> Input Website Sekolah</a>
      </div>
    `;
    sidebar.querySelector('[data-nav="logout"]')?.addEventListener("click", () => {
      localStorage.removeItem("dinasLoggedIn");
    });
  }

  const topbar = $("#dinasTopbar");
  if (topbar) {
    topbar.innerHTML = `
      <div class="topbar-title">
        <strong>${settings.systemName}</strong>
        <span>${settings.agencyName} ${settings.agencyRegion}</span>
      </div>
      <div class="topbar-actions">
        <span class="access-chip"><i class="fa-solid fa-lock"></i> Internal Dinas</span>
        <span><i class="fa-regular fa-calendar"></i> ${todayLabel}</span>
        <span class="profile-pill"><img src="${settings.adminPhotoUrl}" alt="Foto ${settings.adminName}"> ${settings.adminName}</span>
      </div>
    `;
  }
}

function getAppSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(appSettingsKey) || "{}") };
  } catch {
    return defaultSettings;
  }
}

function saveAppSettings(settings) {
  localStorage.setItem(appSettingsKey, JSON.stringify({ ...getAppSettings(), ...settings }));
}

function defaultLogoSvg() {
  return `<svg viewBox="0 0 96 96" role="img" aria-label="Logo Dinas Pendidikan"><rect width="96" height="96" rx="22" fill="#9b0505"/><path d="M48 12 78 26v20c0 19-12 31-30 39-18-8-30-20-30-39V26l30-14Z" fill="#f6c400"/><path d="M31 34h34v8H31v-8Zm0 15h34v8H31v-8Zm7 15h20v7H38v-7Z" fill="#630000"/><circle cx="48" cy="27" r="5" fill="#630000"/></svg>`;
}

function logoMarkup(url, alt, className) {
  if (url) {
    return `<span class="${className}"><img src="${url}" alt="Logo ${alt}" onerror="this.replaceWith(document.createTextNode('D'))"></span>`;
  }
  return `<span class="${className}">${defaultLogoSvg()}</span>`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("Foto gagal dibaca")));
    reader.readAsDataURL(file);
  });
}

function badge(status) {
  const cls = status === "Aktif" ? "active" : status === "Dalam Perbaikan" ? "warning" : "danger";
  return `<span class="badge ${cls}">${status}</span>`;
}

function sourceBadge(source) {
  const label = source === "local" ? "Input Dinas" : "Data Demo";
  const cls = source === "local" ? "warning" : "active";
  return `<span class="badge ${cls}">${label}</span>`;
}

function monitoringState(item) {
  if (item.source === "local") return { label: "Menunggu Validasi", cls: "warning" };
  if (item.status === "Aktif" && contentAverage(item) >= 75) return { label: "Tersinkron", cls: "active" };
  if (item.status === "Tidak Aktif") return { label: "Gagal Diakses", cls: "danger" };
  return { label: "Perlu Cek", cls: "warning" };
}

function progress(value) {
  const tone = value >= 80 ? "good" : value >= 60 ? "warn" : "bad";
  return `<div class="progress ${tone}"><strong>${value}%</strong><span><i style="width:${value}%"></i></span></div>`;
}

function metric(icon, value, label) {
  return `<article class="metric-card"><div class="metric-icon"><i class="fa-solid ${icon}"></i></div><div><strong>${value}</strong><span>${label}</span></div></article>`;
}

function emptyState(message, colspan = 1) {
  return `<tr><td colspan="${colspan}"><div class="empty-state">${message}</div></td></tr>`;
}

function privateBadge(value) {
  const cls = value === "Selesai" || value === "Rendah" ? "active" : value === "Mendesak" || value === "Baru" || value === "Ditolak" ? "danger" : "warning";
  return `<span class="badge ${cls}">${value}</span>`;
}

function schoolLink(item) {
  return `<a class="text-link" href="sekolah-detail.html?id=${encodeURIComponent(item.id)}">Detail</a>`;
}

function contentAverage(item) {
  return item.content ? avg(Object.values(item.content)) : Number(item.completeness || 0);
}

function collectSummary(data) {
  const schools = data.schools;
  return {
    totalSchools: schools.length,
    activeWebsites: schools.filter((item) => item.status === "Aktif").length,
    repairWebsites: schools.filter((item) => item.status === "Dalam Perbaikan").length,
    inactiveWebsites: schools.filter((item) => item.status === "Tidak Aktif").length,
    averageCompleteness: avg(schools.map(contentAverage)),
    totalNews: schools.reduce((sum, item) => sum + Number(item.news || 0), 0),
    totalGallery: schools.reduce((sum, item) => sum + Number(item.gallery || 0), 0),
    totalFacilities: schools.reduce((sum, item) => sum + Number(item.facilities || 0), 0),
    damagedFacilities: schools.reduce((sum, item) => sum + Number(item.damagedFacilities || 0), 0),
    lastUpdate: data.summary?.lastUpdate || "-"
  };
}

function collectPrivateReports(data) {
  const actions = getPrivateReportActions();
  return data.schools.flatMap((school) => (school.privateReports || []).map((report) => {
    const localAction = actions[report.id] || {};
    const followUpStatus = localAction.followUpStatus || report.followUpStatus || report.status || "Baru";
    return {
      ...report,
      ...localAction,
      status: followUpStatus,
      followUpStatus,
      adminNote: localAction.adminNote || report.adminNote || "Belum ada catatan admin Dinas.",
      schoolId: school.id,
      schoolName: school.name,
      level: school.level,
      district: school.district
    };
  }));
}

function getPrivateReportActions() {
  try {
    return JSON.parse(localStorage.getItem(privateReportActionsKey) || "{}");
  } catch {
    return {};
  }
}

function savePrivateReportAction(reportId, action) {
  const actions = getPrivateReportActions();
  actions[reportId] = { ...actions[reportId], ...action };
  localStorage.setItem(privateReportActionsKey, JSON.stringify(actions));
}

async function loadData() {
  const response = await fetch("data/schools.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Data sekolah tidak ditemukan");
  const data = await response.json();
  return mergeLocalSchools(data);
}

function wireFilter(inputs, render) {
  inputs.forEach((el) => el?.addEventListener("input", render));
  render();
}

function getLocalSchools() {
  try {
    return JSON.parse(localStorage.getItem(localSchoolsKey) || "[]");
  } catch {
    return [];
  }
}

function saveLocalSchools(schools) {
  localStorage.setItem(localSchoolsKey, JSON.stringify(schools));
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function makeDefaultContent(value = 30) {
  return Object.fromEntries(Object.keys(contentLabels).map((key) => [key, value]));
}

function mergeLocalSchools(data) {
  const baseSchools = data.schools.map((school) => ({ ...school, source: "demo" }));
  const localSchools = getLocalSchools().map((school) => ({ ...school, source: "local" }));
  const schools = [...baseSchools, ...localSchools];
  return {
    ...data,
    schools,
    users: [
      ...data.users,
      ...localSchools.map((school, index) => ({
        name: school.operator,
        email: `tambahan${index + 1}@sekolah-makassar.sch.id`,
        role: "Operator Sekolah",
        status: "Aktif",
        school: school.name
      }))
    ],
    activities: [
      ...localSchools.map((school) => ({
        school: school.name,
        schoolId: school.id,
        type: "Website",
        description: "Website baru didaftarkan ke dashboard monitoring dinas",
        time: "Baru ditambahkan"
      })),
      ...data.activities
    ],
    reportByLevel: buildReportByLevel(schools)
  };
}

function buildReportByLevel(schools) {
  return Object.values(schools.reduce((acc, school) => {
    acc[school.level] ??= { level: school.level, schools: 0, active: 0, completeness: 0, news: 0, facilities: 0 };
    acc[school.level].schools += 1;
    acc[school.level].active += school.status === "Aktif" ? 1 : 0;
    acc[school.level].completeness += contentAverage(school);
    acc[school.level].news += Number(school.news || 0);
    acc[school.level].facilities += Number(school.facilities || 0);
    return acc;
  }, {})).map((item) => ({ ...item, completeness: Math.round(item.completeness / item.schools) }));
}

function createRegisteredSchool(formData, existingCount) {
  const name = formData.get("name").trim();
  const npsn = formData.get("npsn").trim();
  const level = formData.get("level");
  const district = formData.get("district").trim();
  const url = formData.get("url").trim();
  const operator = formData.get("operator").trim();
  const id = `${slugify(level)}-${slugify(name)}-${Date.now()}`;

  return {
    id,
    name,
    npsn,
    level,
    district,
    address: `Kota Makassar - Kecamatan ${district}`,
    url,
    status: "Dalam Perbaikan",
    completeness: 30,
    lastUpdate: "Baru didaftarkan",
    operator,
    principal: "Belum diisi",
    phone: "-",
    students: 0,
    teachers: 0,
    facilities: 0,
    damagedFacilities: 0,
    news: 0,
    gallery: 0,
    downloads: 0,
    services: 0,
    privateReports: [],
    content: makeDefaultContent(existingCount ? 30 : 0)
  };
}

function renderRegistrationPanel(data) {
  const form = $("#websiteRegisterForm");
  if (!form || form.dataset.ready) return;

  const message = $("#registerMessage");
  const resetButton = $("#resetLocalSchools");
  form.dataset.ready = "true";
  if (location.hash === "#input-website") {
    setTimeout(() => form.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const npsn = formData.get("npsn").trim();
    const url = formData.get("url").trim();
    const current = getLocalSchools();
    const allSchools = data.schools;

    if (allSchools.some((school) => school.npsn === npsn || school.url === url)) {
      message.textContent = "NPSN atau URL website sudah terdaftar di monitoring.";
      message.classList.add("is-error");
      return;
    }

    const newSchool = createRegisteredSchool(formData, allSchools.length);
    saveLocalSchools([newSchool, ...current]);
    message.textContent = `${newSchool.name} berhasil ditambahkan ke monitoring. Status awal: Dalam Perbaikan.`;
    message.classList.remove("is-error");
    form.reset();
    location.reload();
  });

  resetButton?.addEventListener("click", () => {
    saveLocalSchools([]);
    message.textContent = "Data tambahan prototype berhasil direset.";
    location.reload();
  });
}

function renderSettingsPage() {
  const form = $("#settingsForm");
  if (!form) return;

  const settings = getAppSettings();
  Object.entries(settings).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
  updateLogoPreview(settings.logoUrl);
  updateAdminPhotoPreview(settings.adminPhotoUrl);

  form.elements.logoUrl?.addEventListener("input", (event) => updateLogoPreview(event.target.value));
  form.elements.logoFile?.addEventListener("change", async (event) => {
    const dataUrl = await fileToDataUrl(event.target.files[0]);
    if (dataUrl) {
      form.elements.logoUrl.value = dataUrl;
      updateLogoPreview(dataUrl);
    }
  });
  form.elements.adminPhotoUrl?.addEventListener("input", (event) => updateAdminPhotoPreview(event.target.value));
  form.elements.adminPhotoFile?.addEventListener("change", async (event) => {
    const dataUrl = await fileToDataUrl(event.target.files[0]);
    if (dataUrl) {
      form.elements.adminPhotoUrl.value = dataUrl;
      updateAdminPhotoPreview(dataUrl);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const settingsData = Object.fromEntries(formData.entries());
    delete settingsData.logoFile;
    delete settingsData.adminPhotoFile;
    saveAppSettings(settingsData);
    $("#settingsMessage").textContent = "Pengaturan berhasil disimpan. Sidebar dan topbar diperbarui.";
    renderShell();
    updateLogoPreview(formData.get("logoUrl"));
    updateAdminPhotoPreview(formData.get("adminPhotoUrl"));
  });

  $("#resetSettings")?.addEventListener("click", () => {
    localStorage.removeItem(appSettingsKey);
    location.reload();
  });
}

function updateLogoPreview(url) {
  const preview = $("#logoPreview");
  if (preview) preview.innerHTML = url ? `<img src="${url}" alt="Preview logo" onerror="this.replaceWith(document.createTextNode('D'))">` : defaultLogoSvg();
}

function updateAdminPhotoPreview(url) {
  const preview = $("#adminPhotoPreview");
  if (preview) preview.innerHTML = `<img src="${url || defaultSettings.adminPhotoUrl}" alt="Preview foto admin" onerror="this.replaceWith(document.createTextNode('A'))">`;
}

function renderDashboard(data) {
  if (!$("#metricGrid")) return;

  const summary = collectSummary(data);
  $("#metricGrid").innerHTML = [
    metric("fa-school", fmt(summary.totalSchools), "Total Sekolah"),
    metric("fa-globe", fmt(summary.activeWebsites), "Website Aktif"),
    metric("fa-screwdriver-wrench", fmt(summary.repairWebsites + summary.inactiveWebsites), "Perlu Tindak Lanjut"),
    metric("fa-chart-line", `${summary.averageCompleteness}%`, "Rata-rata Konten")
  ].join("");

  const activePercent = Math.round((summary.activeWebsites / Math.max(summary.totalSchools, 1)) * 100);
  $("#activePercent").textContent = `${activePercent}%`;
  $(".donut")?.style.setProperty("--active", `${activePercent}%`);
  $("#statusLegend").innerHTML = [
    `<div class="legend-item"><span>Aktif</span><strong>${fmt(summary.activeWebsites)}</strong></div>`,
    `<div class="legend-item"><span>Dalam Perbaikan</span><strong>${fmt(summary.repairWebsites)}</strong></div>`,
    `<div class="legend-item"><span>Tidak Aktif</span><strong>${fmt(summary.inactiveWebsites)}</strong></div>`
  ].join("");

  $("#contentBars").innerHTML = Object.entries(contentLabels).slice(0, 8).map(([key, label]) => {
    const value = avg(data.schools.map((item) => item.content?.[key] || 0));
    return `<div class="bar-row"><span>${label}</span><div class="bar-track"><span style="width:${value}%"></span></div><strong>${value}%</strong></div>`;
  }).join("");

  $("#activityList").innerHTML = data.activities.slice(0, 7).map((item) => `<div class="activity-item"><div><strong>${item.school}</strong><br><span>${item.type}: ${item.description}</span></div><small>${item.time}</small></div>`).join("");
  $("#lowCompleteness").innerHTML = data.schools.slice().sort((a, b) => contentAverage(a) - contentAverage(b)).slice(0, 7).map((item) => `<div class="low-item"><span>${item.name}<small>${item.district} - ${item.status}</small></span><strong>${contentAverage(item)}%</strong></div>`).join("");
}

function renderSchoolTable(data) {
  const tbody = $("#schoolTable");
  if (!tbody) return;

  const summary = collectSummary(data);
  $("#schoolMetrics").innerHTML = [
    metric("fa-school", fmt(summary.totalSchools), "Sekolah Terdata"),
    metric("fa-globe", fmt(summary.activeWebsites), "Website Aktif"),
    metric("fa-triangle-exclamation", fmt(summary.repairWebsites + summary.inactiveWebsites), "Perlu Perhatian")
  ].join("");

  const search = $("#schoolSearch");
  const level = $("#levelFilter");
  const status = $("#statusFilter");
  const district = $("#districtFilter");

  if (district && !district.dataset.loaded) {
    [...new Set(data.schools.map((item) => item.district))].sort().forEach((name) => {
      district.insertAdjacentHTML("beforeend", `<option>${name}</option>`);
    });
    district.dataset.loaded = "true";
  }

  const render = () => {
    const keyword = (search?.value || "").toLowerCase();
    const filtered = data.schools
      .filter((item) => !keyword || `${item.name} ${item.npsn} ${item.district} ${item.operator}`.toLowerCase().includes(keyword))
      .filter((item) => !level?.value || item.level === level.value)
      .filter((item) => !status?.value || item.status === status.value)
      .filter((item) => !district?.value || item.district === district.value);

    $("#schoolCount").textContent = `${fmt(filtered.length)} sekolah ditampilkan`;
    tbody.innerHTML = filtered.length
      ? filtered.map((item, index) => `<tr><td>${index + 1}</td><td><strong>${item.name}</strong><br><span class="table-subtext">NPSN ${item.npsn}</span></td><td>${item.level}</td><td>${item.district}</td><td>${badge(item.status)}</td><td>${progress(contentAverage(item))}</td><td>${schoolLink(item)}</td></tr>`).join("")
      : emptyState("Tidak ada sekolah yang sesuai dengan filter.", 7);
  };

  wireFilter([search, level, status, district], render);
}

function renderWebsitePage(data) {
  const websiteTable = $("#websiteTable");
  if (!websiteTable) return;

  renderRegistrationPanel(data);

  const summary = collectSummary(data);
  $("#websiteMetrics").innerHTML = [
    metric("fa-globe", fmt(summary.activeWebsites), "Website Aktif"),
    metric("fa-screwdriver-wrench", fmt(summary.repairWebsites), "Dalam Perbaikan"),
    metric("fa-circle-xmark", fmt(summary.inactiveWebsites), "Tidak Aktif"),
    metric("fa-clock", summary.lastUpdate, "Sinkronisasi Terakhir")
  ].join("");

  const localCount = data.schools.filter((item) => item.source === "local").length;
  const waitingValidation = data.schools.filter((item) => monitoringState(item).label === "Menunggu Validasi").length;
  const failedAccess = data.schools.filter((item) => monitoringState(item).label === "Gagal Diakses").length;
  $("#websiteInsights").innerHTML = [
    ["Website Terdaftar", summary.totalSchools, "fa-database"],
    ["Input Baru Dinas", localCount, "fa-user-plus"],
    ["Menunggu Validasi", waitingValidation, "fa-hourglass-half"],
    ["Gagal Diakses", failedAccess, "fa-triangle-exclamation"]
  ].map(([label, value, icon]) => `<div><i class="fa-solid ${icon}"></i><span>${label}</span><strong>${fmt(value)}</strong></div>`).join("");

  $("#runWebsiteCheck")?.addEventListener("click", () => {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    $("#checkMessage").textContent = `Simulasi pengecekan selesai pukul ${now} WITA. Data produksi nantinya diperbarui dari backend.`;
  }, { once: true });

  const statusItems = [
    ["Aktif", summary.activeWebsites, "active"],
    ["Dalam Perbaikan", summary.repairWebsites, "warning"],
    ["Tidak Aktif", summary.inactiveWebsites, "danger"]
  ];
  $("#websiteStatusStack").innerHTML = statusItems.map(([label, count, tone]) => {
    const width = Math.round((count / Math.max(summary.totalSchools, 1)) * 100);
    return `<div class="status-row"><div><span>${label}</span><strong>${fmt(count)} sekolah</strong></div><div class="status-track ${tone}"><i style="width:${width}%"></i></div><small>${width}%</small></div>`;
  }).join("");

  $("#websitePriorityList").innerHTML = data.schools
    .filter((item) => item.status !== "Aktif" || contentAverage(item) < 70)
    .sort((a, b) => contentAverage(a) - contentAverage(b))
    .slice(0, 7)
    .map((item) => `<div class="low-item"><span>${item.name}<small>${item.status} - ${item.lastUpdate}</small></span><strong>${contentAverage(item)}%</strong></div>`)
    .join("");

  const search = $("#websiteSearch");
  const level = $("#websiteLevelFilter");
  const status = $("#websiteStatusFilter");
  const render = () => {
    const keyword = (search?.value || "").toLowerCase();
    const filtered = data.schools
      .filter((item) => !keyword || `${item.name} ${item.url} ${item.operator}`.toLowerCase().includes(keyword))
      .filter((item) => !level?.value || item.level === level.value)
      .filter((item) => !status?.value || item.status === status.value);

    websiteTable.innerHTML = filtered.length
      ? filtered.map((item) => {
        const state = monitoringState(item);
        return `<tr><td><strong>${item.name}</strong><br><span class="table-subtext">${item.level} - ${item.district}</span></td><td><a class="text-link" href="${item.url}" target="_blank">${item.url}</a><br>${sourceBadge(item.source)}</td><td>${badge(item.status)}</td><td>${item.lastUpdate}</td><td><span class="badge ${state.cls}">${state.label}</span></td><td>${item.operator}</td><td>${progress(contentAverage(item))}</td><td>${schoolLink(item)}</td></tr>`;
      }).join("")
      : emptyState("Tidak ada website yang sesuai dengan filter.", 8);
  };
  wireFilter([search, level, status], render);
}

function renderContentPage(data) {
  const contentTable = $("#contentTable");
  if (!contentTable) return;

  const summary = collectSummary(data);
  $("#contentMetrics").innerHTML = [
    metric("fa-file-lines", `${summary.averageCompleteness}%`, "Rata-rata Konten"),
    metric("fa-newspaper", fmt(summary.totalNews), "Total Berita"),
    metric("fa-images", fmt(summary.totalGallery), "Total Foto"),
    metric("fa-download", fmt(data.schools.reduce((sum, item) => sum + Number(item.downloads || 0), 0)), "Dokumen Unduhan")
  ].join("");

  $("#contentBarsFull").innerHTML = Object.entries(contentLabels).map(([key, label]) => {
    const value = avg(data.schools.map((item) => item.content?.[key] || 0));
    return `<div class="bar-row"><span>${label}</span><div class="bar-track"><span style="width:${value}%"></span></div><strong>${value}%</strong></div>`;
  }).join("");

  const search = $("#contentSearch");
  const render = () => {
    const keyword = (search?.value || "").toLowerCase();
    const filtered = data.schools.filter((item) => !keyword || `${item.name} ${item.district}`.toLowerCase().includes(keyword));
    contentTable.innerHTML = filtered.length
      ? filtered.map((item) => `<tr><td><strong>${item.name}</strong><br><span class="table-subtext">${item.level} - ${item.district}</span></td><td>${progress(item.content.profil)}</td><td>${progress(item.content.gtk)}</td><td>${progress(item.content.berita)}</td><td>${progress(item.content.galeri)}</td><td>${progress(item.content.layanan)}</td><td>${progress(contentAverage(item))}</td><td>${schoolLink(item)}</td></tr>`).join("")
      : emptyState("Tidak ada data konten yang sesuai.", 8);
  };
  wireFilter([search], render);
}

function renderFacilityPage(data) {
  const facilityTable = $("#facilityTable");
  if (!facilityTable) return;

  const summary = collectSummary(data);
  const filledFacilities = data.schools.filter((item) => Number(item.facilities || 0) > 0).length;
  const completeFacilityPages = data.schools.filter((item) => Number(item.content?.fasilitas || 0) >= 80).length;
  $("#facilityMetrics").innerHTML = [
    metric("fa-building", fmt(summary.totalFacilities), "Total Data Sarpras"),
    metric("fa-school-circle-check", fmt(filledFacilities), "Sekolah Mengisi Sarpras"),
    metric("fa-file-circle-check", fmt(completeFacilityPages), "Halaman Lengkap"),
    metric("fa-clock", summary.lastUpdate, "Sinkronisasi Terakhir")
  ].join("");

  facilityTable.innerHTML = data.schools
    .slice()
    .sort((a, b) => Number(b.facilities || 0) - Number(a.facilities || 0))
    .map((item) => `<tr><td><strong>${item.name}</strong><br><span class="table-subtext">${item.level} - ${item.district}</span></td><td>${fmt(item.facilities)}</td><td>${item.lastUpdate}</td><td>${badge(item.status)}</td><td>${progress(item.content.fasilitas)}</td><td>${schoolLink(item)}</td></tr>`)
    .join("");
}

function renderPrivateReportsPage(data) {
  const list = $("#privateReportList");
  if (!list) return;

  let reports = collectPrivateReports(data);
  const statusFilter = $("#privateReportStatus");
  const urgencyFilter = $("#privateReportUrgency");
  const typeFilter = $("#privateReportType");
  const schoolFilter = $("#privateReportSchool");
  const districtFilter = $("#privateReportDistrict");
  const levelFilter = $("#privateReportLevel");
  const search = $("#privateReportSearch");
  const modal = $("#privateReportModal");
  let currentFiltered = reports;

  [...new Set(reports.map((report) => report.schoolName))].sort().forEach((school) => {
    schoolFilter.insertAdjacentHTML("beforeend", `<option>${school}</option>`);
  });
  [...new Set(reports.map((report) => report.district))].sort().forEach((district) => {
    districtFilter.insertAdjacentHTML("beforeend", `<option>${district}</option>`);
  });
  [...new Set(reports.map((report) => report.type))].sort().forEach((type) => {
    typeFilter.insertAdjacentHTML("beforeend", `<option>${type}</option>`);
  });

  const renderMetrics = (items) => {
    $("#privateReportMetrics").innerHTML = [
      metric("fa-lock", fmt(items.length), "Total Laporan Privat"),
      metric("fa-triangle-exclamation", fmt(items.filter((report) => report.urgency === "Mendesak").length), "Urgensi Mendesak"),
      metric("fa-hourglass-half", fmt(items.filter((report) => report.followUpStatus !== "Selesai" && report.followUpStatus !== "Ditolak").length), "Butuh Tindak Lanjut"),
      metric("fa-camera", fmt(items.reduce((sum, report) => sum + (report.evidencePhotos?.length || 0), 0)), "Bukti Foto")
    ].join("");
  };

  const render = () => {
    reports = collectPrivateReports(data);
    const keyword = (search?.value || "").toLowerCase();
    const filtered = reports
      .filter((report) => !keyword || `${report.schoolName} ${report.need} ${report.reporter} ${report.type} ${report.adminNote}`.toLowerCase().includes(keyword))
      .filter((report) => !schoolFilter.value || report.schoolName === schoolFilter.value)
      .filter((report) => !districtFilter.value || report.district === districtFilter.value)
      .filter((report) => !levelFilter.value || report.level === levelFilter.value)
      .filter((report) => !statusFilter.value || report.followUpStatus === statusFilter.value)
      .filter((report) => !urgencyFilter.value || report.urgency === urgencyFilter.value)
      .filter((report) => !typeFilter.value || report.type === typeFilter.value);

    currentFiltered = filtered;
    renderMetrics(filtered);
    list.innerHTML = filtered.length
      ? filtered.map((report) => `
        <article class="private-report-card">
          <div class="private-report-head">
            <div>
              <span class="report-code">${report.id}</span>
              <h2>${report.title}</h2>
              <p>${report.schoolName} · ${report.level} · ${report.district}</p>
            </div>
            <div class="report-badges">${privateBadge(report.followUpStatus)}${privateBadge(report.urgency)}</div>
          </div>
          <div class="report-body">
            <div>
              <strong>Kebutuhan Perbaikan</strong>
              <p>${report.need}</p>
            </div>
            <div>
              <strong>Catatan Operator</strong>
              <p>${report.description}</p>
            </div>
          </div>
          <div class="report-meta">
            <span><i class="fa-solid fa-building"></i> ${report.type}</span>
            <span><i class="fa-solid fa-user"></i> ${report.reporter}</span>
            <span><i class="fa-solid fa-calendar"></i> ${report.date}</span>
            <span><i class="fa-solid fa-coins"></i> Estimasi Rp ${fmt(report.estimatedBudget)}</span>
          </div>
          <div class="evidence-row">
            ${(report.evidencePhotos || []).slice(0, 2).map((photo, index) => evidenceThumb(report, photo, index)).join("")}
          </div>
          <div class="report-actions">
            <button class="primary-button slim" data-report-detail="${report.id}" type="button"><i class="fa-solid fa-eye"></i> Lihat Detail</button>
          </div>
        </article>
      `).join("")
      : `<div class="empty-state">Tidak ada laporan privat yang sesuai dengan filter.</div>`;
  };

  const openDetail = (reportId) => {
    const report = collectPrivateReports(data).find((item) => item.id === reportId);
    if (!report || !modal) return;

    $("#privateReportModalTitle").textContent = report.title;
    $("#privateReportModalSubtitle").textContent = `${report.id} · ${report.schoolName} · ${report.level} · ${report.district}`;
    $("#privateReportModalContent").innerHTML = `
      <div class="modal-detail-grid">
        <div class="modal-detail-main">
          <div class="report-badges">${privateBadge(report.followUpStatus)}${privateBadge(report.urgency)}</div>
          <div class="report-body modal-report-body">
            <div><strong>Jenis Laporan</strong><p>${report.type}</p></div>
            <div><strong>Tanggal Laporan</strong><p>${report.date}</p></div>
            <div><strong>Pelapor</strong><p>${report.reporter}</p></div>
            <div><strong>Estimasi Kebutuhan</strong><p>Rp ${fmt(report.estimatedBudget)}</p></div>
            <div><strong>Kebutuhan Perbaikan</strong><p>${report.need}</p></div>
            <div><strong>Catatan Operator Sekolah</strong><p>${report.description}</p></div>
          </div>
          <h3>Bukti Foto Laporan</h3>
          <div class="evidence-gallery">
            ${(report.evidencePhotos || []).map((photo, index) => evidenceFigure(report, photo, index)).join("")}
          </div>
        </div>
        <form class="admin-followup-form" id="privateReportActionForm">
          <label>Status Tindak Lanjut
            <select name="followUpStatus">
              ${["Baru", "Diproses", "Butuh Verifikasi", "Selesai", "Ditolak"].map((status) => `<option ${report.followUpStatus === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </label>
          <label>Catatan Admin Dinas
            <textarea name="adminNote" rows="8" placeholder="Tulis catatan verifikasi, disposisi, atau alasan penolakan...">${report.adminNote || ""}</textarea>
          </label>
          <button class="primary-button" type="submit"><i class="fa-solid fa-floppy-disk"></i> Simpan Tindak Lanjut</button>
          <p class="helper form-note">Perubahan ini tersimpan lokal untuk prototype. Produksi nanti disimpan ke database Dinas.</p>
        </form>
      </div>
    `;

    modal.hidden = false;
    $("#privateReportActionForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      savePrivateReportAction(report.id, {
        followUpStatus: formData.get("followUpStatus"),
        adminNote: formData.get("adminNote")
      });
      modal.hidden = true;
      render();
    });
  };

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-report-detail]");
    if (button) openDetail(button.dataset.reportDetail);
  });

  $("#closePrivateReportModal")?.addEventListener("click", () => {
    modal.hidden = true;
  });
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.hidden = true;
  });

  $("#exportPrivateCsv")?.addEventListener("click", () => exportPrivateReportsCsv(currentFiltered));
  $("#exportPrivatePdf")?.addEventListener("click", () => {
    alert("Export PDF masih dummy untuk prototype. Pada produksi, sistem akan membuat PDF rekap laporan privat dari database.");
  });

  wireFilter([search, schoolFilter, districtFilter, levelFilter, statusFilter, urgencyFilter, typeFilter], render);
}

function evidenceImage(report, photo, index) {
  const title = encodeURIComponent(photo.note || report.type || "Bukti Laporan");
  const school = encodeURIComponent(report.schoolName || "Sekolah");
  const colors = ["#9b0505", "#062b63", "#159947", "#f59e0b"];
  const color = colors[index % colors.length];
  return `data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 420'><rect width='640' height='420' fill='%23f8fafc'/><rect x='28' y='28' width='584' height='364' rx='28' fill='${encodeURIComponent(color)}' opacity='0.12'/><rect x='68' y='76' width='504' height='218' rx='18' fill='${encodeURIComponent(color)}' opacity='0.88'/><circle cx='165' cy='164' r='42' fill='%23f6c400'/><path d='M98 262 210 180l83 64 68-52 181 128H98Z' fill='%23ffffff' opacity='0.78'/><text x='68' y='342' font-family='Arial' font-size='28' font-weight='700' fill='%23111827'>${title}</text><text x='68' y='374' font-family='Arial' font-size='18' fill='%23667085'>${school}</text></svg>`;
}

function evidenceThumb(report, photo, index) {
  return `<div class="evidence-thumb"><img src="${evidenceImage(report, photo, index)}" alt="${photo.label || `Foto ${index + 1}`}"><strong>${photo.label || `Foto ${index + 1}`}</strong><span>${photo.note || "Bukti laporan"}</span></div>`;
}

function evidenceFigure(report, photo, index) {
  return `<figure class="evidence-figure"><img src="${evidenceImage(report, photo, index)}" alt="${photo.label || `Foto ${index + 1}`}"><figcaption><strong>${photo.label || `Foto ${index + 1}`}</strong><span>${photo.note || "Bukti laporan"}</span></figcaption></figure>`;
}

function exportPrivateReportsCsv(reports) {
  const rows = [
    ["ID", "Sekolah", "Jenjang", "Kecamatan", "Jenis", "Kebutuhan", "Status", "Urgensi", "Tanggal", "Pelapor", "Estimasi", "Catatan Admin"],
    ...reports.map((report) => [
      report.id,
      report.schoolName,
      report.level,
      report.district,
      report.type,
      report.need,
      report.followUpStatus,
      report.urgency,
      report.date,
      report.reporter,
      report.estimatedBudget,
      report.adminNote || ""
    ])
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-privat-sekolah.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function renderGalleryPage(data) {
  const galleryTable = $("#galleryTable");
  if (!galleryTable) return;

  $("#galleryMetrics").innerHTML = [
    metric("fa-images", fmt(data.schools.reduce((sum, item) => sum + item.gallery, 0)), "Total Foto"),
    metric("fa-school-circle-check", fmt(data.schools.filter((item) => item.gallery > 0).length), "Sekolah Aktif"),
    metric("fa-triangle-exclamation", fmt(data.schools.filter((item) => item.gallery < 10).length), "Galeri Minim")
  ].join("");

  galleryTable.innerHTML = data.schools
    .slice()
    .sort((a, b) => b.gallery - a.gallery)
    .map((item) => `<tr><td><strong>${item.name}</strong><br><span class="table-subtext">${item.level} - ${item.district}</span></td><td>${fmt(item.gallery)}</td><td>${fmt(item.news)}</td><td>${progress(item.content.galeri)}</td><td>${schoolLink(item)}</td></tr>`)
    .join("");
}

function renderNewsPage(data) {
  const newsActivity = $("#newsActivity");
  if (!newsActivity) return;

  const totalNews = data.schools.reduce((sum, item) => sum + Number(item.news || 0), 0);
  const activePublishers = data.schools.filter((item) => Number(item.news || 0) > 0).length;
  $("#newsMetrics").innerHTML = [
    metric("fa-newspaper", fmt(totalNews), "Total Berita"),
    metric("fa-bullhorn", fmt(data.activities.length), "Aktivitas Terbaru"),
    metric("fa-school-circle-check", fmt(activePublishers), "Sekolah Publikasi"),
    metric("fa-clock", "24 jam", "Rentang Pantauan")
  ].join("");

  const search = $("#newsSearch");
  const typeFilter = $("#newsTypeFilter");
  const renderActivity = () => {
    const keyword = (search?.value || "").toLowerCase();
    const type = typeFilter?.value || "";
    const filtered = data.activities
      .filter((item) => !type || item.type === type)
      .filter((item) => !keyword || `${item.school} ${item.type} ${item.description}`.toLowerCase().includes(keyword));

    newsActivity.innerHTML = filtered.length
      ? filtered.map((item) => `<div class="activity-item"><div class="activity-icon"><i class="fa-solid ${activityIcon(item.type)}"></i></div><div><strong>${item.school}</strong><br><span>${item.type}: ${item.description}</span></div><small>${item.time}</small></div>`).join("")
      : `<div class="empty-state">Tidak ada aktivitas yang sesuai dengan filter.</div>`;
  };
  wireFilter([search, typeFilter], renderActivity);

  $("#newsSchoolTable").innerHTML = data.schools
    .slice()
    .sort((a, b) => Number(b.news || 0) - Number(a.news || 0))
    .map((item) => `<tr><td><strong>${item.name}</strong></td><td>${badge(item.status)}</td><td>${fmt(item.news)}</td><td>${item.lastUpdate}</td><td>${progress(item.content.berita)}</td><td>${schoolLink(item)}</td></tr>`)
    .join("");
}

function renderReportPage(data) {
  const reportMetrics = $("#reportMetrics");
  if (!reportMetrics) return;

  const summary = collectSummary(data);
  reportMetrics.innerHTML = [
    metric("fa-school", fmt(summary.totalSchools), "Total Sekolah"),
    metric("fa-globe", `${Math.round((summary.activeWebsites / summary.totalSchools) * 100)}%`, "Website Aktif"),
    metric("fa-chart-line", `${summary.averageCompleteness}%`, "Kelengkapan Konten"),
    metric("fa-clock", summary.lastUpdate, "Update Terakhir")
  ].join("");

  $("#reportLevelTable").innerHTML = data.reportByLevel.map((item) => `<tr><td><strong>${item.level}</strong></td><td>${fmt(item.schools)}</td><td>${fmt(item.active)}</td><td>${progress(item.completeness)}</td><td>${fmt(item.news)}</td><td>${fmt(item.facilities)}</td></tr>`).join("");

  const monthly = [
    ["Jan", 64], ["Feb", 68], ["Mar", 72], ["Apr", 76], ["Mei", 81], ["Jun", summary.averageCompleteness]
  ];
  $("#monthlyTrend").innerHTML = monthly.map(([label, value]) => `<div class="bar-row"><span>${label}</span><div class="bar-track"><span style="width:${value}%"></span></div><strong>${value}%</strong></div>`).join("");
}

function renderUserPage(data) {
  const userTable = $("#userTable");
  if (!userTable) return;

  $("#userMetrics").innerHTML = [
    metric("fa-users-gear", fmt(data.users.length), "Total Pengguna"),
    metric("fa-user-shield", fmt(data.users.filter((item) => item.role.includes("Dinas")).length), "Akun Dinas"),
    metric("fa-school", fmt(data.users.filter((item) => item.role.includes("Sekolah")).length), "Akun Sekolah")
  ].join("");

  userTable.innerHTML = data.users.map((item) => `<tr><td><strong>${item.name}</strong></td><td>${item.email}</td><td>${item.role}</td><td>${item.school}</td><td>${badge(item.status === "Nonaktif" ? "Tidak Aktif" : item.status)}</td></tr>`).join("");
}

function renderSchoolDetail(data) {
  const detail = $("#schoolDetail");
  if (!detail) return;

  const id = new URLSearchParams(location.search).get("id") || data.schools[0]?.id;
  const item = data.schools.find((school) => school.id === id) || data.schools[0];
  if (!item) {
    detail.innerHTML = `<section class="panel"><div class="empty-state">Data sekolah tidak ditemukan.</div></section>`;
    return;
  }

  document.title = `${item.name} - Detail Monitoring`;
  $("#detailTitle").textContent = item.name;
  $("#detailSubtitle").textContent = `${item.level} - ${item.district} - NPSN ${item.npsn}`;
  $("#detailMetrics").innerHTML = [
    metric("fa-globe", item.status, "Status Website"),
    metric("fa-chart-line", `${contentAverage(item)}%`, "Kelengkapan Konten"),
    metric("fa-newspaper", fmt(item.news), "Berita"),
    metric("fa-building", fmt(item.facilities), "Data Sarpras")
  ].join("");

  $("#detailProfile").innerHTML = `
    <div class="detail-list">
      <div><span>Alamat</span><strong>${item.address}</strong></div>
      <div><span>Website</span><strong><a class="text-link" href="${item.url}" target="_blank">${item.url}</a></strong></div>
      <div><span>Kepala Sekolah</span><strong>${item.principal}</strong></div>
      <div><span>Operator</span><strong>${item.operator}</strong></div>
      <div><span>Telepon</span><strong>${item.phone}</strong></div>
      <div><span>Update Terakhir</span><strong>${item.lastUpdate}</strong></div>
    </div>
  `;

  $("#detailContent").innerHTML = Object.entries(contentLabels).map(([key, label]) => `<div class="bar-row"><span>${label}</span><div class="bar-track"><span style="width:${item.content[key]}%"></span></div><strong>${item.content[key]}%</strong></div>`).join("");
  $("#detailSarpras").innerHTML = [
    ["Peserta Didik", item.students],
    ["GTK", item.teachers],
    ["Data Sarpras Dipublikasi", item.facilities],
    ["Kelengkapan Halaman Fasilitas", `${item.content.fasilitas}%`],
    ["Foto Galeri", item.gallery],
    ["Dokumen Unduhan", item.downloads]
  ].map(([label, value]) => `<div class="stat-line"><span>${label}</span><strong>${typeof value === "number" ? fmt(value) : value}</strong></div>`).join("");
}

function activityIcon(type) {
  const icons = {
    Berita: "fa-newspaper",
    Galeri: "fa-images",
    Konten: "fa-file-lines",
    Sarpras: "fa-building",
    Website: "fa-globe"
  };
  return icons[type] || "fa-bullhorn";
}

async function init() {
  requireLogin();
  renderShell();
  const data = await loadData();
  renderDashboard(data);
  renderSchoolTable(data);
  renderWebsitePage(data);
  renderContentPage(data);
  renderFacilityPage(data);
  renderPrivateReportsPage(data);
  renderGalleryPage(data);
  renderNewsPage(data);
  renderReportPage(data);
  renderUserPage(data);
  renderSchoolDetail(data);
  renderSettingsPage();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("beforeend", `<div class="toast-error">Data dashboard belum bisa dimuat: ${error.message}</div>`);
});
