# Portal Pendidikan Makassar

Prototype platform digitalisasi informasi sekolah terintegrasi untuk presentasi kepada Dinas Pendidikan.

## Bagian Sistem

- Website publik sekolah: `index.html`
- Control panel sekolah: `admin.html`
- Landing program: `program.html`
- Dashboard monitoring Dinas: `dinas/dashboard.html`
- Pelaporan privat Dinas: `dinas/pelaporan-privat.html`

## Jalankan Lokal

```bash
node server.js
```

Buka:

```text
http://127.0.0.1:8000/program.html
```

## Deploy Netlify

Project ini static site. Jika tersambung ke GitHub, Netlify dapat auto deploy dari branch `main`.

Pengaturan Netlify:

- Build command: kosong
- Publish directory: `.`

## Catatan Demo

Pada hosting static, halaman admin dapat tampil untuk demo, tetapi penyimpanan online belum aktif. Untuk produksi dibutuhkan backend, database, autentikasi, dan role akses.
