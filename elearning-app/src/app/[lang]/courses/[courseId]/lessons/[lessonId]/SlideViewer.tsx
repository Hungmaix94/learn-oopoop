'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, Code2, Maximize, Minimize, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import CodeBlock from '@/components/CodeBlock'

interface Slide {
    slideOrder: number
    title: string
    bulletPoints: string[]
    codeExample: string | null
    note: string | null
    imageUrl?: string | null
}

interface SlideViewerProps {
    courseId: string
    lessonTitle: string
    slides: Slide[]
    dict: any
    lang: string
    initialSlide?: number
}

function renderInline(text: string) {
    // Split on backtick-wrapped inline code
    const parts = text.split(/(`[^`]+`)/)
    return parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
            return (
                <code key={i} className="px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/25 text-blue-300 font-mono text-[0.85em] leading-none">
                    {part.slice(1, -1)}
                </code>
            )
        }
        return <span key={i}>{part}</span>
    })
}

export default function SlideViewer({ courseId, lessonTitle, slides, dict, lang, initialSlide = 1 }: SlideViewerProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [currentIndex, setCurrentIndex] = useState(initialSlide - 1)
    const [direction, setDirection] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        router.replace(`${pathname}?slide=${currentIndex + 1}`, { scroll: false })
    }, [currentIndex, pathname, router])

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Fullscreen missing: ${err.message}`)
            })
        } else {
            document.exitFullscreen()
        }
    }

    const isFirst = currentIndex === 0
    const isLast = currentIndex === slides.length - 1

    const nextSlide = useCallback(() => {
        if (!isLast) {
            setDirection(1)
            setCurrentIndex(prev => prev + 1)
        }
    }, [isLast])

    const prevSlide = useCallback(() => {
        if (!isFirst) {
            setDirection(-1)
            setCurrentIndex(prev => prev - 1)
        }
    }, [isFirst])

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide()
            if (e.key === 'ArrowLeft') prevSlide()
            if (e.key === 'f') toggleFullscreen()
            if (e.key === 'Escape' && isFullscreen) document.exitFullscreen()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextSlide, prevSlide, isFullscreen])

    if (!slides || slides.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <Link href={`/${lang}/courses/${courseId}`} className="text-blue-400 hover:underline mb-4 inline-block">{dict.navigation?.backToCourse || "Back to Course"}</Link>
                <div className="text-gray-400">No slides found for this lesson.</div>
            </div>
        )
    }

    const currentSlide = slides[currentIndex]

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    }

    return (
        <div
            ref={containerRef}
            className={`flex flex-col bg-slate-950 ${isFullscreen ? 'w-full h-full overflow-hidden' : 'container mx-auto px-4 py-8 min-h-[calc(100vh-5rem)]'}`}
        >
            {/* Background Decorative Element */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
            </div>

            {/* Header */}
            <div className={`flex items-center justify-between shrink-0 relative z-10 ${isFullscreen ? 'px-8 py-4' : 'mb-6'}`}>
                <div className="flex items-center gap-6">
                    {!isFullscreen && (
                        <Link href={`/${lang}/courses/${courseId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all hover:translate-x-[-4px]">
                            <ArrowLeft className="w-4 h-4" /> {dict.navigation?.back || "Back"}
                        </Link>
                    )}
                    <button onClick={toggleFullscreen} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all hover:scale-105">
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        <span className="text-sm font-medium hidden sm:block">{isFullscreen ? (dict.navigation?.exitFullscreen || 'Exit Fullscreen') : (dict.navigation?.fullscreen || 'Fullscreen')}</span>
                    </button>
                </div>

                <div className="text-gray-400 font-medium bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-xl">
                    <span className="text-blue-400">{currentIndex + 1}</span> / {slides.length}
                </div>
            </div>

            {/* Main Slide Content */}
            <div className={`flex-1 flex flex-col items-center w-full max-w-6xl mx-auto relative min-h-0 ${isFullscreen ? 'overflow-y-auto px-8 py-2' : 'overflow-visible'}`}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.4 }
                        }}
                        className="w-full"
                    >
                        <div className="glass-card w-full p-8 md:p-12 relative flex flex-col border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] group">

                            {/* Animated Border/Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none rounded-[2.5rem]" />
                            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-[2.5rem]" />

                            {/* Progress bar */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 z-10 rounded-t-[2.5rem] overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                />
                            </div>

                            {/* Title */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`text-center ${isFullscreen ? 'mb-6' : 'mb-8'}`}
                            >
                                <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
                                    {lessonTitle}
                                </div>
                                <h2 className={`font-black text-white tracking-tight leading-[1.1] drop-shadow-2xl ${isFullscreen ? 'text-3xl md:text-4xl' : 'text-3xl md:text-4xl'}`}>
                                    {currentSlide.title}
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-4 rounded-full opacity-50" />
                            </motion.div>

                            {/* Body */}
                            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                                {currentSlide.imageUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                                    >
                                        <img
                                            src={currentSlide.imageUrl}
                                            alt={currentSlide.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    </motion.div>
                                )}

                                <motion.ul className={`space-y-4`}>
                                    {currentSlide.bulletPoints.map((point, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ x: -30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 + idx * 0.1 }}
                                            className={`flex items-start gap-4 text-gray-200 leading-relaxed group/item ${isFullscreen ? 'text-lg md:text-xl' : 'text-lg md:text-xl'}`}
                                        >
                                            <div className="mt-2 shrink-0 relative">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 group-hover/item:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping opacity-25" />
                                            </div>
                                            <span className="group-hover/item:text-white transition-colors duration-300">{renderInline(point)}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>

                                {currentSlide.codeExample && (
                                    <motion.div
                                        initial={{ y: 30, opacity: 0, scale: 0.98 }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl group/code"
                                    >
                                        <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                                </div>
                                                <div className="h-4 w-px bg-white/10 ml-2" />
                                                <Code2 className="w-4 h-4 text-blue-400" />
                                                <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">{dict.slide?.example || "Code Implementation"}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono">SQL / Typescript</div>
                                        </div>
                                        <pre className={`p-6 font-mono whitespace-pre-wrap overflow-x-auto selection:bg-blue-500/30 leading-relaxed ${isFullscreen ? 'text-sm md:text-base' : 'text-sm md:text-base'}`}>
                                            <CodeBlock code={currentSlide.codeExample!} />
                                        </pre>
                                    </motion.div>
                                )}

                                {currentSlide.note && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9 }}
                                        className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-center relative overflow-hidden group/note text-base md:text-lg"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                                        <span className="inline-flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                                            <span className="italic">{renderInline(currentSlide.note)}</span>
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className={`flex items-center justify-center gap-6 shrink-0 z-10 relative ${isFullscreen ? 'py-4 px-8' : 'mt-8'}`}>
                <button
                    onClick={prevSlide}
                    disabled={isFirst}
                    className="p-4 rounded-full glass hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 group shadow-2xl"
                >
                    <ChevronLeft className="w-8 h-8 text-white group-hover:text-blue-400 transition-colors" />
                </button>

                <div className="flex flex-col items-center gap-1">
                    <div className="px-8 py-3 rounded-full glass-card border-white/10 text-white font-black tracking-[0.2em] text-base shadow-2xl">
                        {currentIndex + 1} <span className="text-gray-500 mx-1">/</span> {slides.length}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Use arrows or space</div>
                </div>

                <button
                    onClick={nextSlide}
                    disabled={isLast}
                    className="p-4 rounded-full glass hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 group shadow-2xl"
                >
                    <ChevronRight className="w-8 h-8 text-white group-hover:text-blue-400 transition-colors" />
                </button>
            </div>

        </div>
    )
}
