import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getDictionary, Locale } from '@/dictionaries'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Internal E-Learning System',
  description: 'AI-Generated IT Knowledge Base',
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className="dark">
      <body className={inter.className}>
        <header className="glass relative z-50 w-full border-b">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link href={`/${lang}`} className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-80 transition">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <span>E-Learning<span className="text-blue-500">.</span></span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-gray-300">
              <Link href={`/${lang}/courses`} className="hover:text-white transition">{dict.navigation?.backToCourse || "Courses"}</Link>
              <LanguageSwitcher currentLang={lang} />
              <span className="hidden sm:inline px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">
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
