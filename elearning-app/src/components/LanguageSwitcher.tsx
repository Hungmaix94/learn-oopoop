'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const LOCALE_STORAGE_KEY = 'preferred_locale'
const locales = [
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'vi', label: '🇻🇳 VI' },
]

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
    const pathname = usePathname()
    // Hydration-safe: read from localStorage on mount to show the latest preference
    const [activeLocale, setActiveLocale] = useState(currentLang)

    useEffect(() => {
        const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
        if (saved) setActiveLocale(saved)
    }, [])

    const getLocalePath = (targetLang: string) => {
        const segments = pathname.split('/')
        segments[1] = targetLang
        return segments.join('/')
    }

    const handleSwitch = (targetLang: string) => {
        // Persist in localStorage for client-side persistence
        localStorage.setItem(LOCALE_STORAGE_KEY, targetLang)
        // Also set a cookie so the server middleware reads it on next visit
        document.cookie = `${LOCALE_STORAGE_KEY}=${targetLang}; path=/; max-age=31536000` // 1 year
        setActiveLocale(targetLang)
    }

    return (
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
            {locales.map(({ code, label }) => {
                const isActive = activeLocale === code
                return (
                    <Link
                        key={code}
                        href={getLocalePath(code)}
                        onClick={() => handleSwitch(code)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${isActive
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {label}
                    </Link>
                )
            })}
        </div>
    )
}
