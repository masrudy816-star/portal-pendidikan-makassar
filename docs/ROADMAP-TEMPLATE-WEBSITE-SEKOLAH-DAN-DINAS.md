# Roadmap Template Website Sekolah dan Dashboard Dinas

Dokumen ini menjadi pegangan teknis untuk mengembangkan satu template website sekolah menjadi sistem yang siap dipakai oleh 100-300 sekolah di Kota Makassar, serta terhubung ke dashboard monitoring Dinas Pendidikan.

## 1. Tujuan Sistem

Sistem dibagi menjadi tiga bagian utama:

1. Website publik sekolah
   - Untuk branding sekolah, informasi publik, berita, galeri, layanan, PPDB/SPMB, guru/GTK, fasilitas, ekstrakurikuler, dan kontak.
   - Tidak menampilkan data sensitif atau kekurangan sekolah.

2. Control panel sekolah
   - Dipakai admin/operator sekolah untuk mengubah konten tanpa membuka VS Code.
   - Mengelola identitas sekolah, slider, berita, agenda, galeri, fasilitas, ekstrakurikuler, link penting, unduhan, dan pelaporan privat.

3. Dashboard monitoring Dinas
   - Dipakai admin Dinas Pendidikan untuk memantau semua website sekolah.
   - Melihat kelengkapan konten, status website, aktivitas pembaruan, statistik sekolah, dan laporan privat dari sekolah.

## 2. Kondisi Project Saat Ini

Project saat ini sudah memiliki struktur awal yang cukup kuat:

- Website publik sekolah berada di root project.
- Control panel sekolah berada di `admin.html`.
- Data sekolah utama berada di `data/school.json`.
- Backup otomatis berada di `data/school.backup.json`.
- Server lokal berada di `server.js`.
- Dashboard Dinas berada di folder `dinas/`.
- Data dummy dashboard Dinas berada di `dinas/data/schools.json`.
- Upload foto/dokumen admin sekolah sudah diarahkan ke folder `assets/`.
- Fitur `privateReports` sudah tersedia di data sekolah untuk laporan internal ke Dinas.

## 3. Prinsip Arsitektur

1. Website publik dan data privat harus dipisahkan secara konsep.
2. Semua sekolah harus memakai struktur data yang sama.
3. Admin sekolah hanya mengubah konten, bukan tata letak utama.
4. Dashboard Dinas menjadi pusat monitoring.
5. Sistem produksi tidak boleh bergantung pada file JSON manual selamanya.

## 4. Standar Struktur Data Sekolah

Setiap sekolah idealnya memiliki data standar seperti berikut:

- Identitas sekolah: `schoolId`, `npsn`, `educationLevel`, `district`, `accreditation`, `websiteStatus`, `schoolName`, `shortName`, `tagline`, `address`, `phone`, `whatsapp`, `email`, `serviceHours`, `mapEmbedUrl`, `socialMedia`.
- Konten publik: `heroImages`, `services`, `visionMission`, `featuredInfo`, `pages`, `teachers`, `statistics`, `news`, `agenda`, `achievements`, `programs`, `gallery`.
- Konten layanan: `sidebar`, `downloads`, `links`, `ppdb`, `spp`, `eLearning`, `eRapor`, `library`.
- Data privat Dinas: `privateReports`, `facilityConditionReports`, `operatorNotes`, `lastUpdatedAt`, `lastUpdatedBy`.

## 5. Standar Data Pelaporan Privat

Contoh struktur laporan privat:

```json
{
  "id": "report-sarana-toilet-001",
  "reportDate": "2026-06-15",
  "reportedBy": "Operator Sekolah",
  "category": "Sarana Prasarana",
  "itemName": "Toilet",
  "total": "4",
  "good": "3",
  "minorDamage": "0",
  "unusable": "1",
  "urgency": "tinggi",
  "status": "draft",
  "evidenceImage": "assets/img/reports/foto-toilet.jpg",
  "description": "Toilet tersedia 4 unit, 3 baik, 1 tidak layak pakai."
}
```

Status yang disarankan:

- `draft`
- `dikirim`
- `ditinjau`
- `diproses`
- `selesai`
- `ditolak`

Urgensi yang disarankan:

- `rendah`
- `sedang`
- `tinggi`
- `darurat`

## 6. Roadmap Teknis

### Tahap 1 - Pemantapan Template Sekolah

Target: satu website sekolah benar-benar rapi dan siap dijadikan master template.

Pekerjaan:

- Rapikan semua halaman publik.
- Pastikan semua tombol menuju halaman yang benar.
- Pastikan semua konten utama bisa diatur dari admin panel.
- Pastikan admin bisa upload foto dan dokumen.
- Pastikan `school.json` valid dan stabil.
- Pastikan data privat tidak muncul di website publik.
- Buat dokumentasi cara menjalankan website lokal.
- Buat dokumentasi cara admin sekolah mengubah konten.

Status saat ini: sebagian besar sudah selesai, tinggal audit final dan dokumentasi admin.

### Tahap 2 - Standarisasi Template Multi-Sekolah

Target: template bisa digandakan untuk sekolah lain tanpa bongkar kode.

Pekerjaan:

- Buat data contoh untuk beberapa sekolah.
- Tetapkan format `schoolId` dan `npsn` sebagai identitas unik.
- Buat daftar field wajib dan field opsional.
- Buat validasi kelengkapan konten.
- Buat mekanisme reset template ke data sekolah baru.
- Pisahkan konfigurasi sekolah dari layout.
- Siapkan naming folder untuk banyak sekolah.

Contoh struktur:

```text
schools/
  sman-1-makassar/
    data/school.json
    assets/uploads/
  sman-16-makassar/
    data/school.json
    assets/uploads/
  smpn-1-makassar/
    data/school.json
    assets/uploads/
```

### Tahap 3 - Backend Produksi

Target: admin sekolah tidak lagi menyimpan langsung ke file lokal.

Pekerjaan:

- Buat backend API.
- Buat database.
- Buat login admin sekolah.
- Buat role pengguna.
- Simpan semua konten ke database.
- Simpan foto/dokumen ke storage server.
- Buat audit log perubahan.
- Buat backup otomatis.

Rekomendasi role:

- `super_admin_dinas`
- `admin_dinas`
- `operator_dinas`
- `admin_sekolah`
- `operator_sekolah`

### Tahap 4 - Dashboard Monitoring Dinas

Target: Dinas bisa memantau semua sekolah dari satu dashboard.

Pekerjaan:

- Hubungkan dashboard ke daftar sekolah pusat.
- Tampilkan status website aktif/tidak aktif.
- Tampilkan kelengkapan konten per sekolah.
- Tampilkan aktivitas update terbaru.
- Tampilkan daftar laporan privat.
- Tampilkan detail laporan dan foto bukti.
- Tambahkan filter kecamatan, jenjang, status, dan urgensi.
- Tambahkan export laporan PDF/Excel.
- Tambahkan notifikasi laporan baru.

### Tahap 5 - Integrasi Laporan Privat

Target: laporan dari admin sekolah otomatis terlihat di dashboard Dinas.

Alur ideal:

1. Operator sekolah login ke control panel.
2. Operator membuka menu Pelaporan.
3. Operator mengisi laporan kondisi sarana/prasarana atau kebutuhan perbaikan.
4. Operator upload foto bukti.
5. Operator klik kirim laporan.
6. Dashboard Dinas menerima laporan.
7. Admin Dinas meninjau dan memberi status tindak lanjut.
8. Operator sekolah bisa melihat status tindak lanjut di panel sekolah.

### Tahap 6 - Deployment dan Pengadaan

Target: sistem siap dipakai resmi oleh sekolah dan Dinas.

Pekerjaan:

- Tentukan hosting/server.
- Siapkan domain/subdomain sekolah.
- Siapkan SSL HTTPS.
- Siapkan backup harian.
- Siapkan monitoring uptime.
- Siapkan SOP admin sekolah.
- Siapkan pelatihan operator sekolah.
- Siapkan dokumentasi teknis untuk Dinas.
- Siapkan migrasi data untuk 100-300 sekolah.

## 7. Rekomendasi Arsitektur Produksi

```text
Frontend Website Sekolah
        |
Control Panel Sekolah
        |
Backend API Terpusat
        |
Database Terpusat
        |
Dashboard Monitoring Dinas
```

Komponen utama:

- Frontend website sekolah: HTML/CSS/JS atau framework modern.
- Backend API: Node.js/Express, Laravel, atau framework backend lain.
- Database: PostgreSQL atau MySQL.
- File storage: local server storage, S3-compatible storage, atau object storage pemerintah.
- Auth: session/JWT dengan role-based access control.
- Dashboard Dinas: aplikasi admin internal.

## 8. Risiko yang Perlu Diantisipasi

1. Data sekolah tidak seragam.
   - Solusi: buat schema data wajib dan validasi otomatis.

2. Operator sekolah salah input atau menghapus data penting.
   - Solusi: role akses, validasi form, backup, dan audit log.

3. File foto terlalu besar.
   - Solusi: batasi ukuran upload dan kompres gambar.

4. Laporan privat bocor ke publik.
   - Solusi: pisahkan endpoint publik dan endpoint internal.

5. Dashboard Dinas lambat saat jumlah sekolah banyak.
   - Solusi: pagination, cache, dan query database yang benar.

6. Template sekolah berubah tidak konsisten.
   - Solusi: layout dikunci, admin hanya mengubah konten.

7. Tidak ada backup.
   - Solusi: backup database dan file upload secara berkala.

## 9. Checklist Sebelum Produksi

- Website publik semua halaman aman dan rapi.
- Admin sekolah bisa mengubah semua konten utama.
- Pelaporan privat tidak tampil di publik.
- Dashboard Dinas bisa membaca laporan sekolah.
- Login dan role akses sudah aman.
- Upload foto/dokumen dibatasi dan tervalidasi.
- Database sudah digunakan, bukan file JSON manual.
- Backup otomatis aktif.
- Dokumentasi admin sekolah tersedia.
- Dokumentasi admin Dinas tersedia.
- SOP operasional tersedia.

## 10. Rekomendasi Langkah Berikutnya

Langkah paling tepat setelah prototype ini:

1. Finalisasi template sekolah master.
2. Buat schema data resmi untuk semua sekolah.
3. Buat halaman dokumentasi admin sekolah.
4. Buat versi dashboard Dinas yang membaca data dummy multi-sekolah lebih lengkap.
5. Mulai rancang backend produksi dan database.
6. Setelah itu baru siapkan duplikasi untuk banyak sekolah.

## 11. Catatan Strategis

Untuk kebutuhan pengadaan pemerintah, yang paling penting bukan hanya tampilan. Yang harus terlihat kuat adalah:

- sistem bisa diskalakan ke banyak sekolah,
- data sekolah rapi dan terstandar,
- laporan privat aman,
- dashboard Dinas punya manfaat monitoring nyata,
- admin sekolah mudah memakai tanpa teknis coding,
- ada dokumentasi dan SOP.

Dengan arah ini, project tidak terlihat sebagai website sekolah biasa, tetapi sebagai platform monitoring dan pengelolaan website sekolah se-Kota Makassar.
