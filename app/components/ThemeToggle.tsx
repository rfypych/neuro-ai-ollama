"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Komponen hanya akan menampilkan setelah mounted untuk mencegah hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render placeholder yang sama dengan ukuran ikon sampai mounted
  if (!mounted) {
    return <div className="w-5 h-5" />
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
} 