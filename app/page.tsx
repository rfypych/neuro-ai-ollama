import Link from 'next/link'
import { Layout } from './components/Layout'

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-6 text-center">Neura AI</h1>
          <p className="text-xl mb-4 text-center">Chat dengan model Ollama yang di-host secara lokal</p>
          <p className="text-md mb-10 text-center text-muted-foreground">
            Didukung oleh model qwen2.5:3b dan model Ollama lainnya
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <Link 
              href="/chat" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all"
            >
              Mulai Chat
            </Link>
            
            <Link 
              href="/admin" 
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-all"
            >
              Admin Dashboard
            </Link>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            Neura AI adalah chatbot lokal yang aman dan privat
          </p>
        </div>
      </main>
    </Layout>
  )
} 