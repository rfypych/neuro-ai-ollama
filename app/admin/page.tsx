'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layout } from '@/app/components/Layout';

interface ModelInfo {
  name: string;
  size?: string;
  quantization?: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('neura_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      fetchModels(storedApiKey);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchModels = async (key: string) => {
    try {
      // Karena endpoint models mungkin belum diimplementasi,
      // kita akan tampilkan model default saja
      setModels([
        { name: 'qwen2.5:3b', size: '3B', quantization: 'Q4_0' },
        { name: 'gemma:2b', size: '2B', quantization: 'Q4_0' },
        { name: 'tinyllama:latest', size: '1.1B', quantization: 'Q4_0' },
        { name: 'llama3:8b', size: '8B', quantization: 'Q4_0' },
        { name: 'mistral:7b', size: '7B', quantization: 'Q4_0' },
        { name: 'phi3:3b', size: '3B', quantization: 'Q4_0' }
      ]);
    } catch (err) {
      setError('Gagal memuat model, silakan coba lagi');
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse delay-200"></div>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Autentikasi Diperlukan</h1>
            <p className="mb-6">Anda perlu API key untuk mengakses dashboard admin.</p>
            <Link 
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Neura AI Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Kelola model dan konfigurasi AI Anda</p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <div className="bg-card rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Model Tersedia</h2>
                
                {error && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
                    {error}
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Nama Model</th>
                        <th className="text-left py-3 px-4">Ukuran</th>
                        <th className="text-left py-3 px-4">Kuantisasi</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((model) => (
                        <tr key={model.name} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{model.name}</td>
                          <td className="py-3 px-4">{model.size || 'N/A'}</td>
                          <td className="py-3 px-4">{model.quantization || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Aktif
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-card rounded-lg shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">System Prompt Default</h2>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-mono">
                    Anda adalah Neura AI, assistant AI berbahasa Indonesia yang ahli coding dan analisis data.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/4">
              <div className="bg-card rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Navigasi</h2>
                <nav className="space-y-2">
                  <Link 
                    href="/"
                    className="block px-4 py-2 rounded-md hover:bg-muted w-full text-left"
                  >
                    Beranda
                  </Link>
                  <Link 
                    href="/chat"
                    className="block px-4 py-2 rounded-md hover:bg-muted w-full text-left"
                  >
                    Chat
                  </Link>
                </nav>
              </div>

              <div className="bg-card rounded-lg shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Informasi Sistem</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Node.js</span>
                    <span>v18+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next.js</span>
                    <span>v14.1.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ollama</span>
                    <span>Terhubung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 