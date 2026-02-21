'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Code2 } from 'lucide-react'
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
}

export default function SlideViewer({ courseId, lessonTitle, slides }: SlideViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!slides || slides.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <Link href={`/courses/${courseId}`} className="text-blue-400 hover:underline mb-4 inline-block">Back to Course</Link>
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
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-5rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <div className="text-gray-400 font-medium">
                    Slide {currentIndex + 1} of {slides.length}
                </div>
            </div>

            {/* Main Slide Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
                <div className="glass-card w-full rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col min-h-[500px] border-blue-500/20 shadow-2xl">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                        />
                    </div>

                    <div className="mb-10 text-center">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            {currentSlide.title}
                        </h2>
                        <div className="w-24 h-1 bg-blue-500/50 mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-6 max-w-3xl mx-auto w-full">
                        <ul className="space-y-4">
                            {currentSlide.bulletPoints.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-lg md:text-xl text-gray-300 leading-relaxed">
                                    <span className="shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2.5" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>

                        {currentSlide.codeExample && (
                            <div className="mt-8 rounded-2xl bg-black/60 border border-gray-800 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border-b border-gray-800">
                                    <Code2 className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">Example</span>
                                </div>
                                <pre className="p-6 text-sm md:text-base font-mono text-green-400/90 whitespace-pre-wrap overflow-x-auto">
                                    {currentSlide.codeExample}
                                </pre>
                            </div>
                        )}
                    </div>

                    {currentSlide.note && (
                        <div className="mt-10 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm md:text-base text-center italic">
                            💡 {currentSlide.note}
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
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
