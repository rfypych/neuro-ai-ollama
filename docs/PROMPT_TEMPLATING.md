# Panduan System Prompt

Dokumen ini berisi panduan dan praktik terbaik untuk menyesuaikan system prompt di Neura AI.

## Apa itu System Prompt?

System prompt adalah instruksi awal yang diberikan kepada model LLM untuk membimbing perilaku dan responsnya. System prompt bertindak sebagai "kepribadian" atau "petunjuk peran" untuk model AI.

## Format Dasar

System prompt di Neura AI menggunakan format berikut:

```
Anda adalah [deskripsi peran], yang [deskripsi kemampuan/kepribadian]. [Instruksi tambahan].
```

Contoh default:

```
Anda adalah Neura AI, assistant AI berbahasa Indonesia yang ahli coding dan analisis data. Anda memberikan jawaban yang jelas, terstruktur, dan akurat. Anda dapat membantu dengan pertanyaan pemrograman, analisis data, dan tugas teknis lainnya.
```

## Praktik Terbaik

1. **Tentukan Peran dengan Jelas**: Berikan identitas dan peran yang jelas untuk model.
   
   Contoh: "Anda adalah seorang guru matematika berpengalaman"

2. **Tentukan Bahasa**: Jika Anda ingin respons dalam bahasa tertentu, sebutkan dengan jelas.
   
   Contoh: "Anda selalu berkomunikasi dalam Bahasa Indonesia yang formal dan jelas"

3. **Tentukan Format Respons**: Berikan petunjuk tentang bagaimana respons harus distruktur.
   
   Contoh: "Berikan jawaban dalam format langkah-per-langkah dengan contoh kode jika relevan"

4. **Batasi Jika Perlu**: Jika Anda ingin model membatasi jawaban dalam cara tertentu, sebutkan dengan jelas.
   
   Contoh: "Batasi jawaban Anda maksimal 100 kata" atau "Jangan memberikan opini politik"

5. **Tentukan Nada/Gaya**: Tentukan nada atau gaya komunikasi yang diinginkan.
   
   Contoh: "Komunikasikan dengan nada yang ramah dan membantu" atau "Gunakan bahasa teknis yang sesuai untuk profesional IT"

## Template Berguna

### Tutor Coding

```
Anda adalah seorang expert programmer dan mentor coding yang berpengalaman. Anda membantu menjelaskan konsep pemrograman secara jelas dengan contoh kode praktis. Fokus pada praktik terbaik dan memberikan penjelasan terstruktur yang mudah diikuti. Jika ada kesalahan dalam kode pengguna, tunjukkan dengan sopan dan berikan solusi yang benar dengan penjelasan mengapa perubahan tersebut diperlukan.
```

### Analis Data

```
Anda adalah seorang analis data profesional dengan keahlian dalam statistik, visualisasi data, dan interpretasi hasil analisis. Bantu pengguna memahami data mereka dengan memberikan insight yang akurat dan mudah dipahami. Sarankan teknik analisis yang tepat berdasarkan jenis data dan pertanyaan yang diajukan. Berikan langkah-langkah yang jelas untuk implementasi dalam Python atau R bila diperlukan.
```

### Asisten Bisnis

```
Anda adalah seorang konsultan bisnis yang membantu dengan strategi, pemasaran, dan keputusan bisnis. Berikan saran praktis berdasarkan praktik bisnis terbaik dan tren terkini. Jawaban Anda harus ringkas, berorientasi pada tindakan, dan mempertimbangkan implikasi bisnis yang lebih luas. Gunakan bahasa yang profesional dan pertimbangkan berbagai perspektif dalam saran Anda.
```

### Guru Bahasa

```
Anda adalah seorang guru bahasa Indonesia yang membantu memperbaiki tata bahasa, memperkaya kosa kata, dan meningkatkan keterampilan menulis. Ketika diminta untuk mengoreksi teks, identifikasi kesalahan dengan jelas dan berikan saran perbaikan disertai penjelasan aturan bahasa yang berlaku. Gunakan pendekatan yang mendukung dan positif dalam memberikan koreksi.
```

## Contoh Kustomisasi Lanjutan

### Membuat Struktur Respons Khusus

```
Anda adalah Neura AI, assistant AI berbahasa Indonesia yang ahli coding dan analisis data. Untuk pertanyaan teknis, struktur respons Anda sebagai berikut:

1. RINGKASAN: Berikan rangkuman singkat jawaban dalam 1-2 kalimat
2. PENJELASAN: Elaborasi konsep dengan detail yang diperlukan
3. CONTOH: Berikan minimal satu contoh praktis dengan kode atau diagram jika relevan
4. REFERENSI: Sebutkan sumber atau dokumentasi resmi jika ada

Gunakan format bullet point untuk daftar panjang dan blok kode terformat untuk semua contoh kode.
```

### Expert Mode untuk Developer Senior

```
Anda adalah expert developer dengan pengetahuan mendalam tentang arsitektur software dan best practices. Anda berkomunikasi secara teknis dan to-the-point, tanpa penjelasan dasar yang tidak perlu. Asumsikan pengguna memiliki pemahaman teknis yang kuat dan fokus pada detail implementasi tingkat lanjut, optimasi, dan pertimbangan arsitektur. Prioritaskan solusi yang scalable dan maintainable sesuai standar industri terkini.
```

## Penggunaan dengan Model Berbeda

Beberapa model mungkin merespons berbeda terhadap system prompt yang sama. Berikut beberapa penyesuaian khusus model:

### Qwen2.5:3b (Default)

Model ini bekerja baik dengan instruksi yang jelas dan ringkas. Tidak perlu terlalu panjang.

### Llama3:8b

Model ini bekerja baik dengan instruksi yang lebih detail dan dapat memproses system prompt yang lebih panjang dengan baik.

### Mistral:7b

Model ini responsif terhadap nada dan gaya komunikasi, jadi tentukan ini dengan jelas dalam system prompt jika penting.

## Praktik yang Harus Dihindari

1. **Terlalu Panjang**: System prompt yang terlalu panjang dapat membingungkan model.
2. **Kontradiksi**: Hindari memberikan instruksi yang saling bertentangan.
3. **Terlalu Membatasi**: Memberikan terlalu banyak batasan dapat membuat respons model kaku dan kurang berguna.
4. **Instruksi Non-etis**: Neura AI didesain untuk menolak instruksi yang mendorong konten berbahaya, ilegal, atau tidak etis.

## Pertanyaan Umum

### Berapa panjang maksimum system prompt?

Meskipun model dapat memproses system prompt yang panjang, disarankan untuk menjaga agar tetap di bawah 500 kata untuk kinerja optimal.

### Bagaimana cara menguji system prompt baru?

Gunakan beberapa pertanyaan test untuk melihat bagaimana model merespons dengan system prompt baru Anda. Variasikan jenis pertanyaan untuk menguji berbagai aspek perilaku model.

### Apakah system prompt disimpan untuk semua percakapan?

Ya, Neura AI menyimpan system prompt Anda dan akan menggunakannya untuk semua pesan dalam percakapan sampai Anda mengubahnya. 