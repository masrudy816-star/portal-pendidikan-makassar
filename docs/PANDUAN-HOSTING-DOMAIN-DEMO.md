# Panduan Hosting dan Domain Demo Presentasi

Panduan ini dibuat untuk menayangkan prototype sistem secara online agar bisa dipresentasikan kepada Dinas Pendidikan.

## 1. Tujuan Demo Online

Yang ditonjolkan bukan hanya website sekolah, tetapi program:

**Platform Digitalisasi Informasi Sekolah Terintegrasi**

Alur demo:

1. Buka halaman program: `/program.html`
2. Buka contoh website sekolah: `/index.html`
3. Buka control panel sekolah: `/admin.html`
4. Buka dashboard Dinas: `/dinas/dashboard.html`
5. Buka pelaporan privat Dinas: `/dinas/pelaporan-privat.html`

## 2. Rekomendasi Termurah

### Opsi Demo Paling Murah

- Hosting: Cloudflare Pages atau Netlify Free
- Domain: `.site` atau `.my.id`
- Estimasi awal: puluhan ribu rupiah tahun pertama, tergantung promo registrar.

### Opsi Demo Lebih Profesional

- Hosting: Cloudflare Pages atau Netlify Free
- Domain: `.id`
- Estimasi awal: sekitar ratusan ribu rupiah per tahun, tergantung registrar.

Rekomendasi untuk presentasi Dinas: gunakan domain `.id` jika memungkinkan, karena terlihat lebih serius.

## 3. Nama Domain yang Disarankan

Gunakan nama program, bukan nama satu sekolah.

Contoh:

- `digitalisasipendidikanmakassar.id`
- `monitoringsekolahmakassar.id`
- `portalpendidikanmakassar.id`
- `sistemsekolahmakassar.id`
- `sekolahterintegrasi.id`

Kalau ingin paling murah:

- `monitoringsekolahmakassar.site`
- `digitalisasipendidikanmakassar.site`

## 4. Catatan Penting Soal Admin Online

Hosting gratis seperti Cloudflare Pages atau Netlify adalah hosting static.

Artinya:

- Website sekolah bisa dibuka online.
- Dashboard Dinas bisa dibuka online.
- Control panel sekolah bisa dibuka online sebagai demo tampilan.
- Tetapi tombol simpan admin tidak akan benar-benar menyimpan online karena fitur simpan saat ini memakai `server.js` lokal.

Untuk tahap presentasi awal, ini cukup.

Untuk tahap produksi, perlu backend dan database.

## 5. Cara Deploy ke Cloudflare Pages

1. Buka Cloudflare.
2. Buat akun atau login.
3. Masuk ke menu **Workers & Pages**.
4. Pilih **Create application**.
5. Pilih **Pages**.
6. Pilih upload assets atau connect repository.
7. Upload file ZIP deploy dari project ini.
8. Setelah berhasil, Cloudflare memberi URL gratis seperti:

```text
https://nama-project.pages.dev
```

9. Tes halaman:

```text
/program.html
/index.html
/admin.html
/dinas/dashboard.html
/dinas/pelaporan-privat.html
```

## 6. Cara Deploy ke Netlify

1. Buka Netlify.
2. Buat akun atau login.
3. Pilih **Add new site**.
4. Pilih **Deploy manually**.
5. Upload file ZIP deploy atau drag folder project.
6. Netlify memberi URL gratis seperti:

```text
https://nama-project.netlify.app
```

7. Tes halaman demo.

## 7. Cara Sambungkan Domain

Setelah domain dibeli:

1. Buka dashboard hosting, misalnya Cloudflare Pages atau Netlify.
2. Masuk ke menu custom domain.
3. Tambahkan domain, misalnya:

```text
monitoringsekolahmakassar.id
```

4. Hosting akan memberi instruksi DNS.
5. Buka tempat membeli domain.
6. Masuk ke pengaturan DNS.
7. Tambahkan record sesuai instruksi hosting.

Umumnya:

- Untuk root domain memakai `A`, `AAAA`, atau `CNAME flattening`.
- Untuk subdomain `www` memakai `CNAME`.

Contoh:

```text
www  CNAME  nama-project.pages.dev
```

## 8. Struktur URL Demo yang Disarankan

Gunakan urutan presentasi ini:

```text
https://domainkamu.id/program.html
https://domainkamu.id/index.html
https://domainkamu.id/admin.html
https://domainkamu.id/dinas/dashboard.html
https://domainkamu.id/dinas/pelaporan-privat.html
```

## 9. Narasi Presentasi Singkat

Gunakan narasi ini:

> Program ini bukan hanya pembuatan website sekolah. Ini adalah platform digitalisasi pendidikan yang menghubungkan website publik sekolah, control panel operator sekolah, dan dashboard monitoring Dinas Pendidikan. Sekolah dapat mengelola informasi secara mandiri, sementara Dinas dapat memantau aktivitas, kelengkapan informasi, dan laporan privat sekolah secara terintegrasi.

## 10. Tahap Setelah Demo

Jika Dinas tertarik, tahap berikutnya:

1. Buat backend produksi.
2. Buat database terpusat.
3. Buat login role admin sekolah dan admin Dinas.
4. Integrasikan laporan privat dari sekolah ke dashboard Dinas.
5. Siapkan deployment untuk 100-300 sekolah.
6. Siapkan SOP operator sekolah dan admin Dinas.
