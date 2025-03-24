"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Neura AI</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/chat"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Chat
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Admin
            </Link>
          </nav>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 