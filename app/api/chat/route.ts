import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { Ratelimit } from '@/lib/types';

// Variabel untuk konfigurasi Ollama
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'qwen2.5:3b';
const OLLAMA_TIMEOUT = 120000; // 120 detik (2 menit) timeout

// Limiter: 5 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const apiKey = req.headers.get('Authorization')?.split(' ')[1];

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key diperlukan' },
      { status: 401 }
    );
  }

  // Validasi API key
  // TODO: Implementasikan validasi API key dengan database

  try {
    // Rate limiting
    const result = await limiter.limit(ip);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { messages, model = DEFAULT_MODEL } = await req.json();

    // Validasi input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages diperlukan dan harus berupa array' },
        { status: 400 }
      );
    }

    console.log(`[INFO] Processing chat request with model: ${model}`);
    console.log(`[INFO] Message count: ${messages.length}`);

    // Enkode ReadableStream untuk streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Buat abort controller untuk timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('[ERROR] Request to Ollama timed out after 25s');
    }, OLLAMA_TIMEOUT);

    // Proses asinkron untuk menangani response dari Ollama
    (async () => {
      try {
        console.log('[INFO] Sending request to Ollama API...');
        
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            prompt: formatMessages(messages),
            stream: true,
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          const error = `Ollama API returned ${response.status}: ${errorText}`;
          console.error('[ERROR]', error);
          
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ error })}\n\n`)
          );
          await writer.close();
          return;
        }

        if (!response.body) {
          const error = 'No response body from Ollama';
          console.error('[ERROR]', error);
          
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ error })}\n\n`)
          );
          await writer.close();
          return;
        }

        console.log('[INFO] Streaming response from Ollama...');
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Stream response ke client
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              await writer.close();
              console.log('[INFO] Stream complete');
              break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.trim() === '') continue;
              
              try {
                const data = JSON.parse(line);
                if (data.done) {
                  await writer.close();
                  console.log('[INFO] Stream complete (marked as done)');
                  return;
                }
                
                // Streaming response chunk
                const text = data.response || '';
                await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              } catch (err) {
                console.error('[ERROR] Failed to parse JSON from Ollama:', line);
                console.error(err);
              }
            }
          }
        } catch (streamError) {
          console.error('[ERROR] Stream processing error:', streamError);
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ error: 'Error memproses stream respons' })}\n\n`)
          );
          await writer.close();
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('[ERROR] Ollama API error:', error);
        
        let errorMessage = 'Koneksi ke Ollama gagal';
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = 'Koneksi ke Ollama timeout setelah 25 detik';
          } else {
            errorMessage = error.message;
          }
        }
        
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
        );
        await writer.close();
      }
    })().catch(async (error) => {
      console.error('[ERROR] Unhandled promise rejection:', error);
      try {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ error: 'Terjadi kesalahan yang tidak tertangani' })}\n\n`)
        );
        await writer.close();
      } catch (e) {
        console.error('[ERROR] Failed to write error to stream:', e);
      }
    });

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[ERROR] Error processing request:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal' },
      { status: 500 }
    );
  }
}

// Helper untuk memformat pesan dari format ChatGPT ke format text Ollama
function formatMessages(messages: any[]): string {
  // Filter pesan system dan gabungkan dengan prompt
  const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
  
  // Ambil semua pesan user dan assistant dalam urutan kronologis
  const conversation = messages.filter(m => m.role === 'user' || m.role === 'assistant');
  
  // Format pesan dengan jelas
  let formattedPrompt = systemPrompt ? `${systemPrompt}\n\n` : '';
  
  for (const msg of conversation) {
    const role = msg.role === 'user' ? 'Human' : 'Assistant';
    formattedPrompt += `${role}: ${msg.content}\n`;
  }
  
  // Tambahkan token akhir untuk AI
  formattedPrompt += 'Assistant:';
  
  return formattedPrompt;
} 