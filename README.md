# Pengumuman Nilai TKA

Website pengumuman nilai TKA untuk sekolah. Siswa memasukkan NISN dan langsung melihat nilai mereka.

## Fitur

- Halaman siswa: cari nilai dengan NISN
- Halaman admin: upload data nilai dari file CSV
- Desain modern dengan gradient ungu-biru
- Bisa di-deploy gratis di Vercel

---

## Cara Deploy ke Vercel (Gratis)

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/USERNAME/pengumuman-tka.git
git push -u origin main
```

### 2. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → Sign up / Login
2. Klik **"Add New Project"** → Import repository GitHub
3. Biarkan semua pengaturan default → klik **Deploy**

### 3. Tambah Vercel Blob Storage

1. Di Vercel Dashboard → pilih project → tab **Storage**
2. Klik **Create Database** → pilih **Blob**
3. Klik **Connect to Project** (token otomatis ditambahkan ke env vars)

### 4. Set Environment Variables di Vercel

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

| Nama | Nilai |
|------|-------|
| `ADMIN_PASSWORD` | Password pilihan Anda |
| `NEXT_PUBLIC_SCHOOL_NAME` | Nama sekolah Anda |
| `NEXT_PUBLIC_SCHOOL_SUBTITLE` | Teks subtitle (contoh: Pengumuman Nilai TKA 2025/2026) |

> `BLOB_READ_WRITE_TOKEN` sudah otomatis ditambahkan oleh Vercel Blob.

5. Klik **Redeploy** setelah menambahkan env vars.

---

## Format File CSV

File CSV harus memiliki kolom berikut (baris pertama adalah header):

```
NISN,Nama,TTL,Nilai MTK,Nilai Bahasa Indonesia
1234567890,Budi Santoso,"Madiun, 10 Januari 2013",85,90
```

**Catatan:** Untuk file Excel, simpan dulu sebagai CSV:
Excel → File → Save As → pilih format **CSV UTF-8**

---

## Cara Menggunakan Panel Admin

1. Buka `https://[domain-anda]/admin`
2. Masukkan password admin
3. Upload file CSV nilai siswa
4. Cek preview data di tabel
5. Klik **Simpan Data**
6. Bagikan link utama `https://[domain-anda]` ke siswa

---

## Development Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Atur `.env.local`:

```env
ADMIN_PASSWORD=password-anda
NEXT_PUBLIC_SCHOOL_NAME=Nama Sekolah
NEXT_PUBLIC_SCHOOL_SUBTITLE=Pengumuman Nilai TKA 2025/2026
```

> Tanpa `BLOB_READ_WRITE_TOKEN`, data disimpan di folder `data/students.json` (hanya untuk development lokal).
