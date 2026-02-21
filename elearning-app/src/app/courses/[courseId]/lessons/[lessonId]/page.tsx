import { getLessonSlides, getLessons } from '@/lib/data'
import SlideViewer from './SlideViewer'
import { notFound } from 'next/navigation'

export default async function LessonPage({
    params
}: {
    params: Promise<{ courseId: string, lessonId: string }>
}) {
    const resolvedParams = await params;
    const slides = await getLessonSlides(resolvedParams.lessonId)
    const lessons = await getLessons(resolvedParams.courseId)

    const lesson = lessons.find((l: any) => l.lessonId === resolvedParams.lessonId)

    if (!lesson || !slides.length) {
        return notFound()
    }

    return (
        <SlideViewer
            courseId={resolvedParams.courseId}
            lessonTitle={lesson.lessonTitle}
            slides={slides}
        />
    )
}
