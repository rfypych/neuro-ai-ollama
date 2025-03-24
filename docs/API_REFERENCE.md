# API Reference Neura AI

Dokumen ini memberikan informasi lengkap tentang API yang tersedia di Neura AI.

## Autentikasi

Semua endpoint API memerlukan autentikasi menggunakan API key. API key harus disertakan dalam header HTTP `Authorization` dengan format:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoint

### Chat

#### POST /api/chat

Endpoint ini digunakan untuk berinteraksi dengan model LLM.

**Request Format:**

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Anda adalah Neura AI, assistant AI berbahasa Indonesia yang ahli coding dan analisis data."
    },
    {
      "role": "user",
      "content": "Tolong jelaskan cara menggunakan fungsi map di JavaScript."
    }
  ],
  "model": "qwen2.5:3b"
}
```

**Parameters:**

- `messages` (required): Array objek pesan, dengan setiap pesan memiliki `role` ("system", "user", atau "assistant") dan `content` (teks pesan).
- `model` (optional): String yang menentukan model LLM yang akan digunakan. Default: "qwen2.5:3b".

**Response:**

Response menggunakan format Server-Sent Events (SSE) yang memungkinkan streaming token-by-token. Format untuk setiap chunk:

```
data: {"text":"Token dari respons model"}
```

**Kode Status:**

- `200 OK`: Request berhasil diproses.
- `400 Bad Request`: Format request tidak valid.
- `401 Unauthorized`: API key tidak disediakan atau tidak valid.
- `429 Too Many Requests`: Rate limit terlampaui.
- `500 Internal Server Error`: Terjadi kesalahan server.

**Contoh Penggunaan (JavaScript):**

```javascript
async function chatWithNeura() {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: 'Apa itu JavaScript?'
        }
      ],
      model: 'qwen2.5:3b'
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.substring(6));
          console.log(data.text);
        } catch (e) {
          console.error('Error parsing SSE:', e);
        }
      }
    }
  }
}
```

### Models

#### GET /api/models

Mendapatkan daftar model yang tersedia dari Ollama.

**Response Format:**

```json
{
  "models": [
    {
      "name": "qwen2.5:3b",
      "size": "3B",
      "quantization": "Q4_0",
      "created_at": "2023-06-20T12:30:45Z"
    },
    {
      "name": "llama3:8b",
      "size": "8B",
      "quantization": "Q4_0",
      "created_at": "2023-05-18T09:15:30Z"
    }
  ]
}
```

**Kode Status:**

- `200 OK`: Request berhasil diproses.
- `401 Unauthorized`: API key tidak disediakan atau tidak valid.
- `500 Internal Server Error`: Terjadi kesalahan server.

### Users & API Keys

#### POST /api/users

Membuat pengguna baru dengan API key yang dihasilkan secara otomatis.

**Request Format:**

```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response Format:**

```json
{
  "id": "user_123456",
  "email": "user@example.com",
  "name": "John Doe",
  "apiKey": "neur_a1b2c3d4e5f6g7h8i9j0",
  "createdAt": "2023-06-20T12:30:45Z"
}
```

#### GET /api/users/me

Mendapatkan informasi tentang pengguna saat ini berdasarkan API key.

**Response Format:**

```json
{
  "id": "user_123456",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2023-06-20T12:30:45Z"
}
```

### Conversations

#### GET /api/conversations

Mendapatkan daftar percakapan untuk pengguna saat ini.

**Response Format:**

```json
{
  "conversations": [
    {
      "id": "conv_123456",
      "title": "JavaScript Questions",
      "createdAt": "2023-06-20T12:30:45Z",
      "updatedAt": "2023-06-20T12:45:30Z"
    },
    {
      "id": "conv_789012",
      "title": "Python Tutorial",
      "createdAt": "2023-06-19T10:15:20Z",
      "updatedAt": "2023-06-19T10:30:15Z"
    }
  ]
}
```

#### GET /api/conversations/:id

Mendapatkan percakapan tertentu dengan semua pesannya.

**Response Format:**

```json
{
  "id": "conv_123456",
  "title": "JavaScript Questions",
  "createdAt": "2023-06-20T12:30:45Z",
  "updatedAt": "2023-06-20T12:45:30Z",
  "messages": [
    {
      "id": "msg_123456",
      "content": "Apa itu JavaScript?",
      "role": "user",
      "createdAt": "2023-06-20T12:30:45Z"
    },
    {
      "id": "msg_789012",
      "content": "JavaScript adalah bahasa pemrograman tingkat tinggi...",
      "role": "assistant",
      "createdAt": "2023-06-20T12:31:15Z"
    }
  ]
}
```

#### POST /api/conversations

Membuat percakapan baru.

**Request Format:**

```json
{
  "title": "New Conversation"
}
```

**Response Format:**

```json
{
  "id": "conv_123456",
  "title": "New Conversation",
  "createdAt": "2023-06-20T12:30:45Z",
  "updatedAt": "2023-06-20T12:30:45Z",
  "messages": []
}
```

#### DELETE /api/conversations/:id

Menghapus percakapan tertentu.

**Response Format:**

```json
{
  "success": true,
  "message": "Conversation deleted"
}
```

### Export

#### GET /api/export/conversation/:id

Mengekspor percakapan dalam format PDF atau Markdown.

**Query Parameters:**

- `format`: "pdf" atau "md" (default: "pdf")

**Response:**

File PDF atau Markdown yang dapat diunduh. 