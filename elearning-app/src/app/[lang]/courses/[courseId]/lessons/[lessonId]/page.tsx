import { getLessonSlides, getLessons } from '@/lib/data'
import SlideViewer from './SlideViewer'
import { notFound } from 'next/navigation'
import { getDictionary, Locale } from '@/dictionaries'

export default async function LessonPage({
    params
}: {
    params: Promise<{ courseId: string, lessonId: string, lang: string }>
}) {
    const resolvedParams = await params;
    const { lang, courseId, lessonId } = resolvedParams;
    const slides = await getLessonSlides(lessonId, lang)
    const lessons = await getLessons(courseId)
    const dict = await getDictionary(lang as Locale);

    const lesson = lessons.find((l: any) => l.lessonId === lessonId)

    if (!lesson || !slides.length) {
        return notFound()
    }

    return (
        <SlideViewer
            courseId={courseId}
            lessonTitle={lesson.lessonTitle}
            slides={slides}
            dict={dict}
            lang={lang}
        />
    )
}
