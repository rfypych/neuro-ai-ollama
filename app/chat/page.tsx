'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/app/components/ChatWindow';
import { Layout } from '@/app/components/Layout';

export default function ChatPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeModel, setActiveModel] = useState('qwen2.5:3b');
  const [systemPrompt, setSystemPrompt] = useState(
    'Anda adalah Neura AI, assistant AI berbahasa Indonesia yang ahli coding dan analisis data.'
  );
  
  // Muat API key dari localStorage saat komponen dimuat
  useEffect(() => {
    setIsLoading(true);
    const storedApiKey = localStorage.getItem('neura_api_key');
    const storedModel = localStorage.getItem('neura_model');
    const storedPrompt = localStorage.getItem('neura_system_prompt');
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    
    if (storedModel) {
      setActiveModel(storedModel);
    }
    
    if (storedPrompt) {
      setSystemPrompt(storedPrompt);
    }
    
    setIsLoading(false);
  }, []);
  
  // Simpan model yang dipilih ke localStorage
  const handleModelChange = (model: string) => {
    setActiveModel(model);
    localStorage.setItem('neura_model', model);
  };
  
  // Simpan system prompt ke localStorage
  const handleSystemPromptChange = (prompt: string) => {
    setSystemPrompt(prompt);
    localStorage.setItem('neura_system_prompt', prompt);
  };

  // Handler untuk menyimpan API key
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('api-key-input') as HTMLInputElement;
    const newApiKey = input.value.trim();
    
    if (newApiKey) {
      localStorage.setItem('neura_api_key', newApiKey);
      setApiKey(newApiKey);
    }
  };
  
  // Render loading state jika sedang loading
  if (isLoading) {
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

  // Render form untuk memasukkan API key jika belum ada
  if (!apiKey) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Neura AI</h1>
              <p className="mt-2 text-muted-foreground">Silakan masukkan API key untuk memulai</p>
            </div>
            
            <form onSubmit={handleApiKeySubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="api-key-input" className="block text-sm font-medium text-foreground">
                  API Key
                </label>
                <input
                  id="api-key-input"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="neur_xxxxxxxxxxxx"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Mulai Chat
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <p>
                Belum punya API key?{' '}
                <button 
                  onClick={() => {
                    router.push('/');
                  }} 
                  className="text-primary hover:underline"
                >
                  Kembali ke halaman utama
                </button>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="h-full flex flex-col">
        <ChatWindow 
          apiKey={apiKey}
          activeModel={activeModel}
          systemPrompt={systemPrompt}
          onModelChange={handleModelChange}
        />
      </div>
    </Layout>
  );
} 