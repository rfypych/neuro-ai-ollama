"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { Menu, ChevronLeft, ChevronRight, Home, MessageSquare, Settings } from "lucide-react";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dispatch custom event ketika status sidebar berubah
  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    // Simpan preferensi di localStorage
    localStorage.setItem('sidebar_expanded', newExpandedState.toString());
    
    // Dispatch event untuk memberi tahu komponen lain
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { expanded: newExpandedState } 
    });
    window.dispatchEvent(event);
  };

  // Mencegah hydration error dan memuat preferensi dari localStorage
  useEffect(() => {
    setMounted(true);
    
    // Memuat preferensi sidebar dari localStorage (jika ada)
    const savedPreference = localStorage.getItem('sidebar_expanded');
    if (savedPreference !== null) {
      const isExpandedSaved = savedPreference === 'true';
      setIsExpanded(isExpandedSaved);
      
      // Trigger event untuk komponen Layout
      const event = new CustomEvent('sidebar-toggle', { 
        detail: { expanded: isExpandedSaved } 
      });
      window.dispatchEvent(event);
    }
  }, []);

  if (!mounted) {
    return <div className="fixed top-0 left-0 h-full w-16 bg-card border-r"></div>;
  }

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-card border-r transition-all duration-300 z-40 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          {isExpanded && (
            <Link href="/" className="font-bold text-xl">
              Neura AI
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-secondary"
            aria-label={isExpanded ? "Minimize sidebar" : "Maximize sidebar"}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        <nav className="flex-grow py-6">
          <ul className="space-y-2 px-2">
            <li>
              <Link
                href="/"
                className={`flex items-center rounded-md px-3 py-2 hover:bg-secondary ${
                  isExpanded ? "justify-start" : "justify-center"
                }`}
              >
                <Home size={20} />
                {isExpanded && <span className="ml-3">Beranda</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/chat"
                className={`flex items-center rounded-md px-3 py-2 hover:bg-secondary ${
                  isExpanded ? "justify-start" : "justify-center"
                }`}
              >
                <MessageSquare size={20} />
                {isExpanded && <span className="ml-3">Chat</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className={`flex items-center rounded-md px-3 py-2 hover:bg-secondary ${
                  isExpanded ? "justify-start" : "justify-center"
                }`}
              >
                <Settings size={20} />
                {isExpanded && <span className="ml-3">Admin</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className={`p-4 border-t ${isExpanded ? "flex justify-between" : "flex justify-center"}`}>
          {isExpanded && <span className="text-sm text-muted-foreground">v1.0.0</span>}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
} 