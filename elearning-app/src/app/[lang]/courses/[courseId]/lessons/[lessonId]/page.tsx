import { getLessonSlides, getLessons } from '@/lib/data'
import SlideViewer from './SlideViewer'
import { notFound } from 'next/navigation'
import { getDictionary, Locale } from '@/dictionaries'

export default async function LessonPage({
    params,
    searchParams,
}: {
    params: Promise<{ courseId: string, lessonId: string, lang: string }>
    searchParams: Promise<{ slide?: string }>
}) {
    const resolvedParams = await params;
    const resolvedSearch = await searchParams;
    const { lang, courseId, lessonId } = resolvedParams;
    const slides = await getLessonSlides(lessonId, lang)
    const lessons = await getLessons(courseId)
    const dict = await getDictionary(lang as Locale);

    const lesson = lessons.find((l: any) => l.id === lessonId)

    if (!lesson || !slides.length) {
        return notFound()
    }

    const slideParam = parseInt(resolvedSearch.slide ?? '1', 10)
    const initialSlide = Math.max(1, Math.min(slideParam, slides.length))

    return (
        <SlideViewer
            courseId={courseId}
            lessonTitle={lesson.title}
            slides={slides}
            dict={dict}
            lang={lang}
            initialSlide={initialSlide}
        />
    )
}
