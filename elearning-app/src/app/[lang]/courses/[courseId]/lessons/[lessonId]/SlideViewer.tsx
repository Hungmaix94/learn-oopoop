'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Code2, Maximize, Minimize } from 'lucide-react'
import Link from 'next/link'

interface Slide {
    slideOrder: number
    title: string
    bulletPoints: string[]
    codeExample: string | null
    note: string | null
}

interface SlideViewerProps {
    courseId: string
    lessonTitle: string
    slides: Slide[]
    dict: any
    lang: string
}

export default function SlideViewer({ courseId, lessonTitle, slides, dict, lang }: SlideViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

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

    if (!slides || slides.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <Link href={`/${lang}/courses/${courseId}`} className="text-blue-400 hover:underline mb-4 inline-block">{dict.navigation?.backToCourse || "Back to Course"}</Link>
                <div className="text-gray-400">No slides found for this lesson.</div>
            </div>
        )
    }

    const currentSlide = slides[currentIndex]
    const isFirst = currentIndex === 0
    const isLast = currentIndex === slides.length - 1

    const nextSlide = () => { if (!isLast) setCurrentIndex(prev => prev + 1) }
    const prevSlide = () => { if (!isFirst) setCurrentIndex(prev => prev - 1) }

    return (
        <div
            ref={containerRef}
            className={`mx-auto flex flex-col transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[100] bg-slate-950 px-4 md:px-20 py-10 w-full h-full justify-center space-y-4 overflow-y-auto' : 'container px-4 py-8 min-h-[calc(100vh-5rem)]'}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex justify-center items-center gap-6">
                    {!isFullscreen && (
                        <Link href={`/${lang}/courses/${courseId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" /> {dict.navigation?.back || "Back"}
                        </Link>
                    )}
                    <button onClick={toggleFullscreen} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        <span className="text-sm font-medium hidden sm:block">{isFullscreen ? (dict.navigation?.exitFullscreen || 'Exit Fullscreen') : (dict.navigation?.fullscreen || 'Fullscreen')}</span>
                    </button>
                </div>

                <div className="text-gray-400 font-medium bg-black/40 px-4 py-1.5 rounded-full border border-gray-800">
                    {dict.slide?.slideText || "Slide"} {currentIndex + 1} / {slides.length}
                </div>
            </div>

            {/* Main Slide Content */}
            <div className={`flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto min-h-0 ${isFullscreen ? 'h-full' : ''}`}>
                <div className={`glass-card w-full p-10 md:p-16 relative flex flex-col border-blue-500/20 shadow-2xl ${isFullscreen ? 'h-full justify-center overflow-y-auto rounded-[2.5rem]' : 'rounded-3xl min-h-[500px] overflow-hidden'}`}>

                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 z-10">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                        />
                    </div>

                    <div className="mb-10 text-center">
                        <h2 className={`${isFullscreen ? 'text-5xl md:text-7xl mb-12' : 'text-3xl md:text-5xl'} font-extrabold text-white tracking-tight leading-tight transition-all duration-500`}>
                            {currentSlide.title}
                        </h2>
                        {!isFullscreen && <div className="w-24 h-1 bg-blue-500/50 mx-auto mt-6 rounded-full" />}
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-6 max-w-3xl mx-auto w-full">
                        <ul className="space-y-4">
                            {currentSlide.bulletPoints.map((point, idx) => (
                                <li key={idx} className={`flex items-start gap-4 ${isFullscreen ? 'text-xl md:text-2xl mb-4' : 'text-lg md:text-xl'} text-gray-300 leading-relaxed transition-all duration-300`}>
                                    <span className={`shrink-0 rounded-full bg-blue-400 ${isFullscreen ? 'w-3 h-3 mt-3' : 'w-2 h-2 mt-2.5'}`} />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>

                        {currentSlide.codeExample && (
                            <div className="mt-8 rounded-2xl bg-black/60 border border-gray-800 overflow-hidden shadow-2xl">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border-b border-gray-800">
                                    <Code2 className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">{dict.slide?.example || "Example"}</span>
                                </div>
                                <pre className={`p-6 font-mono text-green-400/90 whitespace-pre-wrap overflow-x-auto ${isFullscreen ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>
                                    {currentSlide.codeExample}
                                </pre>
                            </div>
                        )}
                    </div>

                    {currentSlide.note && (
                        <div className={`mt-10 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-center italic ${isFullscreen ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>
                            💡 {currentSlide.note}
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-6 shrink-0 z-10">
                <button
                    onClick={prevSlide}
                    disabled={isFirst}
                    className="p-4 rounded-full glass hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                </button>

                <div className="px-6 py-3 rounded-full glass-input text-gray-300 font-medium tracking-widest text-sm">
                    {currentIndex + 1} / {slides.length}
                </div>

                <button
                    onClick={nextSlide}
                    disabled={isLast}
                    className="p-4 rounded-full glass hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                </button>
            </div>

        </div>
    )
}
