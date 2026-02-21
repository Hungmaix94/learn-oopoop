import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Internal E-Learning System',
  description: 'AI-Generated IT Knowledge Base',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <header className="glass relative z-50 w-full border-b">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-80 transition">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <span>E-Learning<span className="text-blue-500">.</span></span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-300">
              <Link href="/courses" className="hover:text-white transition">Courses</Link>
              <span className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">
                Internal Team Only
              </span>
            </nav>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  )
}
