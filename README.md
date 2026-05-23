# Auto-Backup Database MySQL ke Discord
Bot Discord berbasis Node.js yang berfungsi untuk melakukan backup (dump) database MySQL secara otomatis, mengompresnya menjadi file ZIP agar ukurannya lebih kecil, lalu mengirimkannya ke channel Discord pada waktu yang sudah dijadwalkan.

## Fitur
- **Penjadwalan Otomatis (Cron Job)**: Backup otomatis setiap hari pada jam tertentu (Zona Waktu: WIB).
- **Kompresi ZIP**: File `.sql` dikompres menjadi `.zip` secara otomatis untuk menghemat ruang dan menghindari limitasi ukuran file Discord (Maksimal 25MB untuk server biasa).
- **Pengiriman Otomatis**: Langsung dikirim ke channel Discord.
- **Pembersihan Otomatis**: File `.sql` asli akan langsung dihapus setelah proses compress dan pengiriman selesai untuk menghemat penyimpanan lokal.

## Persyaratan
Sebelum menjalankan script ini, pastikan sistem kamu sudah terinstall:
1. [Node.js](https://nodejs.org/) (Versi 16.x atau terbaru)
2. **MySQL / XAMPP**: Pastikan command `mysqldump` sudah bisa dijalankan dari terminal. *(Jika menggunakan XAMPP di Windows, tambahkan folder `C:\xampp\mysql\bin` ke dalam Environment Variables PATH)*.
3. Bot Discord yang sudah di-invite ke server kamu dengan akses View Channels, Send Messages, dan Attach Files.

## Instalasi
1. Pastikan semua file (`package.json`, `config.json`, dan `bot.js`) sudah ada di satu folder yang sama.
2. Buka terminal di folder tersebut, lalu jalankan perintah berikut untuk menginstal semua module yang dibutuhkan:

```bash
npm install
```

## Konfigurasi
Buka file `config.json` dan ubah sesuai dengan server discord dan bot kamu:
```json
{
  "DISCORD_TOKEN": "tokem-bot",
  "CHANNEL_ID": "1472475656645251164",
  "DB_USER": "root",
  "DB_PASS": "",
  "DB_NAME": "s8_martin",
  "DB_HOST": "localhost",
  "JADWAL_BACKUP": "14:30"
}
```

**Keterangan:**
* `DISCORD_TOKEN`: Token bot kamu yang didapat dari discord developer portal.
* `CHANNEL_ID`: ID channel tempat bot akan mengirim file backup.
* `DB_USER` & `DB_PASS`: Username dan password database.
* `DB_NAME`: Nama database yang ingin di-backup.
* `DB_HOST`: Host database.
* `JADWAL_BACKUP`: Jam berapa backup dilakukan (Format 24 Jam, zona waktu otomatis mengikuti WIB / Asia/Jakarta).

## Cara Menjalankan
Kamu bisa menjalankan bot ini menggunakan perintah node:
```bash
node bot.js
```

## Struktur Folder

```text
martin/
├── backups/          <-- Folder ini bakal dibuat otomatis buat menyimpan file zip sementara.
├── bot.js            <-- Script/FIle utama bot.
├── config.json       <-- File config.
├── package.json      <-- Daftar-Daftar module dependency.
└── README.md         <-- File dokumentasi ini.
```

## Catatan Penting
Discord memiliki limit pengiriman file sebesar **25 MB** untuk akun dan server yang tidak di-boost. Jika ukuran file `.zip` hasil backup database kamu melebihi 25 MB, bot tidak akan bisa mengirimkannya ke Discord dan akan menghasilkan error.
