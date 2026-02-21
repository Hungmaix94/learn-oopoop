import { getCourse, getLessons } from '@/lib/data'
import { ArrowLeft, PlayCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, Locale } from '@/dictionaries'

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string, lang: string }> }) {
    const { courseId, lang } = await params;
    const dict = await getDictionary(lang as Locale);
    const course = await getCourse(courseId)
    if (!course) return notFound()

    const lessons = await getLessons(courseId)

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <Link href={`/${lang}/courses`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
                    <ArrowLeft className="w-4 h-4" /> {dict.navigation?.backToCourse || "Back to Courses"}
                </Link>

                <div className="glass-card rounded-3xl p-10 mb-12 border-blue-500/20">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl mb-6 border border-blue-500/20">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">{course.title}</h1>
                    <p className="text-gray-400 text-lg leading-relaxed">{course.description}</p>
                </div>

                <h2 className="text-2xl font-semibold text-white mb-6 px-2 flex items-center gap-3">
                    Course Modules
                    <span className="text-sm px-3 py-1 bg-gray-800 rounded-full text-gray-400 font-normal border border-gray-700">
                        {lessons.length} {dict.courses?.lessons || "Lessons"}
                    </span>
                </h2>

                <div className="space-y-4">
                    {lessons.map((lesson: any, index: number) => (
                        <Link
                            key={lesson.lessonId}
                            href={`/${lang}/courses/${courseId}/lessons/${lesson.lessonId}`}
                            className="block group"
                        >
                            <div className="glass-input p-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/40 hover:bg-white/10">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">
                                            {lesson.lessonTitle}
                                        </h3>
                                        <p className="text-sm text-gray-400 pr-8">{lesson.summary}</p>
                                    </div>
                                </div>
                                <div className="shrink-0 text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                                    <PlayCircle className="w-8 h-8" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div >
    )
}
