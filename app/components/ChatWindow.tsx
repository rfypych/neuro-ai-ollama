import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import Link from 'next/link';
import Logo from './Logo';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

interface ChatWindowProps {
  apiKey: string;
  initialMessages?: Message[];
  activeModel: string;
  systemPrompt: string;
  onModelChange?: (model: string) => void;
}

export default function ChatWindow({
  apiKey,
  initialMessages = [],
  activeModel = 'qwen2.5:3b',
  systemPrompt = 'Anda adalah Neura AI, assistant AI berbahasa Indonesia yang ahli coding dan analisis data.',
  onModelChange
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Efek untuk scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Efek untuk syntax highlighting
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [messages]);

  // Format waktu pesan
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Kirim pesan ke API
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Tambahkan pesan pengguna ke state
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      createdAt: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    // Persiapan untuk pesan assistant
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      createdAt: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    try {
      // Siapkan konteks dengan 10 pesan terakhir
      const contextMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: input }
      ];
      
      console.log(`Mengirim pesan dengan model: ${activeModel}`);
      
      // Batas waktu maksimum untuk request (120 detik / 2 menit)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);
      
      // Fetch API untuk streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          messages: contextMessages,
          model: activeModel
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || 
          `Error: ${response.status} ${response.statusText}`
        );
      }
      
      if (!response.body) {
        throw new Error('Stream tidak tersedia');
      }
      
      // Proses streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let fullResponse = '';
      let streamTimeout: NodeJS.Timeout | null = null;
      
      // Batas waktu untuk setiap chunk (30 detik)
      const resetStreamTimeout = () => {
        if (streamTimeout) clearTimeout(streamTimeout);
        streamTimeout = setTimeout(() => {
          reader.cancel().catch(console.error);
          throw new Error('Timeout: Tidak ada respons dari model dalam 30 detik');
        }, 30000);
      };
      
      resetStreamTimeout();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            if (streamTimeout) clearTimeout(streamTimeout);
            break;
          }
          
          resetStreamTimeout();
          
          // Decode chunk
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          
          for (const line of lines) {
            if (line.trim() === '') continue;
            
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                
                if (data.error) {
                  throw new Error(data.error);
                }
                
                const textChunk = data.text || '';
                fullResponse += textChunk;
                
                // Update pesan terakhir dengan potongan baru
                setMessages(prev => {
                  const updated = [...prev];
                  const lastMessage = updated[updated.length - 1];
                  
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = fullResponse;
                  }
                  
                  return updated;
                });
              } catch (e) {
                console.error('Error parsing SSE:', e);
                if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
                  throw e;
                }
              }
            }
          }
        }
      } catch (streamError) {
        if (streamTimeout) clearTimeout(streamTimeout);
        throw streamError;
      }
      
      // Jika respons kosong, tambahkan pesan error
      if (!fullResponse.trim()) {
        throw new Error('Respons kosong dari model. Coba lagi atau pilih model lain.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Terjadi kesalahan saat mengirim pesan';
      
      setError(errorMessage);
      
      // Update pesan terakhir dengan error
      setMessages(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = `Maaf, terjadi kesalahan: ${errorMessage}. Pastikan Ollama sedang berjalan dan model ${activeModel} sudah terinstal.`;
        }
        
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header dengan model selector */}
      <div className="bg-card border-b p-4 flex justify-between items-center">
        <Logo />
        
        <select 
          value={activeModel}
          onChange={(e) => onModelChange?.(e.target.value)}
          className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md"
        >
          <option value="qwen2.5:3b">Qwen 2.5 (3B)</option>
          <option value="gemma:2b">Gemma (2B)</option>
          <option value="tinyllama:latest">TinyLlama (1.1B)</option>
        </select>
      </div>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-24 h-24">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary/50"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
                <path
                  d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-primary">Selamat Datang di Neura AI</h3>
              <p className="text-muted-foreground max-w-md">
                Saya adalah asisten AI yang siap membantu Anda dengan pertanyaan seputar coding, analisis data, dan topik lainnya.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              <div className="bg-card p-4 rounded-lg border space-y-2">
                <h4 className="font-semibold text-primary">💡 Tips Penggunaan</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gunakan Ctrl+Enter untuk mengirim pesan</li>
                  <li>• Pilih model AI sesuai kebutuhan</li>
                  <li>• Tanyakan hal spesifik untuk hasil lebih baik</li>
                  <li>• Gunakan markdown untuk format teks</li>
                </ul>
              </div>
              
              <div className="bg-card p-4 rounded-lg border space-y-2">
                <h4 className="font-semibold text-primary">🚀 Contoh Pertanyaan</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Bantu saya debug kode ini"</li>
                  <li>• "Jelaskan konsep React hooks"</li>
                  <li>• "Bantu analisis dataset ini"</li>
                  <li>• "Optimalkan query database ini"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <div className="text-sm opacity-70 mb-1">
                  {message.role === 'user' ? 'Anda' : 'Neura AI'} • {formatTime(message.createdAt)}
                </div>
                
                <div className="prose dark:prose-invert prose-sm">
                  <ReactMarkdown
                    components={{
                      // @ts-ignore - inline prop does exist in ReactMarkdown but TypeScript doesn't recognize it
                      code({ node, inline, className, children, ...props }) {
                        if (inline) {
                          return <code className="bg-secondary-foreground/10 px-1 py-0.5 rounded" {...props}>{children}</code>;
                        }
                        
                        return (
                          <pre className="rounded-md overflow-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground p-3 rounded-lg max-w-[80%]">
              <div className="text-sm opacity-70 mb-1">
                Neura AI • {formatTime(new Date())}
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t">
        {error && (
          <div className="bg-destructive/10 text-destructive p-2 rounded-md mb-2 text-sm">
            {error}
            <div className="mt-1 text-xs">
              <Link href="/bug-report" className="text-blue-600 hover:underline">
                Laporkan masalah ini
              </Link>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan Anda di sini..."
            className="flex-1 resize-none min-h-[80px] p-3 border rounded-md bg-background"
            disabled={isLoading}
          />
          
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md self-end hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Kirim
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          Tekan Ctrl+Enter (atau Cmd+Enter di Mac) untuk mengirim
        </div>
      </div>
    </div>
  );
} 