"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mendengarkan event dari Sidebar
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setIsSidebarExpanded(e.detail.expanded);
    };

    // Menandai komponen sudah dimount untuk mencegah hydration error
    setMounted(true);
    
    // Memuat preferensi sidebar dari localStorage (jika ada)
    const savedPreference = localStorage.getItem('sidebar_expanded');
    if (savedPreference !== null) {
      setIsSidebarExpanded(savedPreference === 'true');
    }

    window.addEventListener('sidebar-toggle' as any, handleSidebarToggle);
    
    return () => {
      window.removeEventListener('sidebar-toggle' as any, handleSidebarToggle);
    };
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className={`flex-grow transition-all duration-300 ${isSidebarExpanded ? "ml-64" : "ml-16"}`}>
        {children}
      </main>
    </div>
  );
} 