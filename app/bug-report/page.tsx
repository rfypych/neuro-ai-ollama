'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BugReportPage() {
  const [bugDescription, setBugDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi pengiriman laporan bug
    // Di implementasi nyata, Anda dapat mengirimnya ke endpoint API atau email
    console.log('Bug Report:', {
      description: bugDescription,
      steps,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Laporan Berhasil Dikirim!</h2>
          <p className="text-green-700 mb-6">
            Terima kasih telah membantu meningkatkan Neura AI. Kami akan segera memeriksa laporan Anda.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <Link 
              href="/chat"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Kembali ke Chat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Laporkan Bug atau Masalah</h1>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tips Sebelum Melaporkan</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Pastikan Ollama berjalan dengan menjalankan <code className="bg-gray-200 px-1 py-0.5 rounded">curl http://localhost:11434/api/tags</code></li>
          <li>Pastikan model yang Anda gunakan sudah diinstal dengan <code className="bg-gray-200 px-1 py-0.5 rounded">ollama list</code></li>
          <li>Coba refresh halaman atau mulai ulang aplikasi</li>
          <li>Periksa koneksi internet Anda</li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-lg font-medium mb-2">
            Deskripsi Bug
          </label>
          <textarea
            id="description"
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="Jelaskan masalah yang Anda alami secara detail..."
          />
        </div>
        
        <div>
          <label htmlFor="steps" className="block text-lg font-medium mb-2">
            Langkah-langkah untuk Mereproduksi
          </label>
          <textarea
            id="steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="1. Buka halaman chat&#10;2. Masukkan API key&#10;3. Kirim pesan '...'&#10;4. ..."
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Link 
            href="/chat"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Kembali
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting || !bugDescription}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center text-gray-500">
        <p>
          Anda juga dapat membuka issue di GitHub atau menghubungi tim dukungan kami melalui email.
        </p>
      </div>
    </div>
  );
} 