# Neura AI - Self-Hosted LLM Chatbot

Neura AI adalah aplikasi chatbot yang memanfaatkan model bahasa besar (LLM) dari Ollama untuk memberikan pengalaman AI yang dihosting secara lokal. Dirancang untuk pengguna Indonesia, Neura AI menyediakan antarmuka yang modern dan intuitif untuk berinteraksi dengan berbagai model AI.

## Fitur Utama

- **Integrasi real-time dengan Ollama** - Mendukung model qwen2.5:3b dan lainnya
- **Antarmuka modern** - Dengan dukungan Markdown, syntax highlighting untuk kode, dan riwayat percakapan
- **Model switching** - Beralih antar model secara dinamis
- **Streaming response** - Melihat respons token-by-token secara real time
- **Sistem keamanan** - API key authentication, rate limiting, dan sanitasi input
- **Context-aware memory** - Menggunakan 10 pesan terakhir sebagai context window
- **System prompt customization** - Sesuaikan perilaku AI sesuai kebutuhan Anda
- **File upload** - Unggah dokumentasi untuk referensi
- **Export chat** - Simpan percakapan sebagai PDF atau Markdown

## Prasyarat

- Node.js 18+ dan npm
- [Ollama](https://ollama.ai/) terinstall dan berjalan di mesin lokal
- Model Ollama yang dibutuhkan:
  - qwen2.5:3b
  - (opsional) model lain yang ingin digunakan

## Instalasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/yourusername/neura-ai.git
   cd neura-ai
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Siapkan database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```

5. Buka browser dan kunjungi `http://localhost:3000`

## Penggunaan Docker

Neura AI mendukung deployment melalui Docker untuk kemudahan setup:

```bash
# Build dan jalankan container
docker-compose up -d
```

## API Reference

Untuk dokumentasi API lengkap, lihat [docs/API_REFERENCE.md](docs/API_REFERENCE.md).

## Panduan System Prompt

Untuk informasi tentang cara menyesuaikan system prompt, lihat [docs/PROMPT_TEMPLATING.md](docs/PROMPT_TEMPLATING.md).

## Kontribusi

Kontribusi selalu diterima! Silakan buka issue atau pull request untuk perbaikan atau fitur baru.

## Lisensi

[MIT License](LICENSE)

## Mengatasi Masalah Loading yang Tidak Berhenti

Jika Anda mengalami masalah di mana indikator loading pesan tidak berhenti meskipun CPU sudah kembali normal, berikut beberapa langkah yang dapat dicoba:

### 1. Periksa Status Ollama

Pastikan Ollama berjalan dengan benar:

```bash
curl http://localhost:11434/api/tags
```

Jika tidak mendapatkan respons JSON yang berisi daftar model, kemungkinan Ollama tidak berjalan atau mengalami masalah.

### 2. Gunakan Debug Panel

Neura AI menyediakan panel debug yang dapat diakses dengan menekan **Ctrl+Shift+D** pada halaman web aplikasi. Panel ini dapat membantu mendiagnosis masalah umum.

### 3. Mulai Ulang Aplikasi

```bash
# Hentikan aplikasi dengan Ctrl+C di terminal
# Kemudian jalankan kembali
npm run dev
```

### 4. Reset Cache Browser

Dalam beberapa kasus, cached resources dapat menyebabkan masalah:

1. Buka DevTools (F12 atau Ctrl+Shift+I)
2. Navigasi ke tab Application > Storage
3. Centang "Clear site data" dan klik "Clear site data"

### 5. Laporkan Bug

Jika masalah tetap berlanjut, gunakan halaman [laporan bug](/bug-report) untuk melaporkan masalah secara detail.

## Menggunakan Timeout dan Penanganan Error yang Ditingkatkan

Versi terbaru Neura AI telah ditingkatkan dengan:

- Timeout 120 detik (2 menit) untuk request API
- Timeout 30 detik untuk setiap chunk streaming
- Penanganan error yang lebih jelas
- Panel diagnostik untuk debugging

Peningkatan ini membantu menghilangkan masalah loading yang terjebak dan memberikan pesan error yang lebih jelas saat terjadi masalah. Waktu timeout yang diperpanjang sangat berguna untuk model AI yang lebih besar atau koneksi jaringan yang lebih lambat. 