import { getAllCourses } from '@/lib/data'
import { BookOpen, Presentation, ChevronRight, Layers } from 'lucide-react'
import Link from 'next/link'
import { getDictionary, Locale } from '@/dictionaries'

export default async function CoursesPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);
    const courses = await getAllCourses()

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">
                        {dict.courses.title}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {dict.courses.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {courses.map(course => (
                        <Link key={course.id} href={`/${lang}/courses/${course.id}`} className="group block">
                            <div className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden h-full flex flex-col cursor-pointer border-blue-500/20 hover:border-blue-500/50">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <Layers className="w-32 h-32" />
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20 shadow-inner">
                                    <BookOpen className="w-7 h-7" />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                </h2>
                                <p className="text-gray-400 leading-relaxed mb-8 flex-1">
                                    {course.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Presentation className="w-4 h-4" />
                                        <span>{course.lessons?.length || 0} {dict.courses.lessons}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                                        {dict.home.startLearning} <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-50 border-dashed border-gray-600">
                        <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center text-gray-500 mb-4">
                            +
                        </div>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">More Courses Coming Soon</h3>
                        <p className="text-sm text-gray-500">The Orchestrator is currently processing more markdown bases.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
