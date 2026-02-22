import 'reflect-metadata';
import { getDataSource } from './db';
import { Course } from '@/entities/Course';
import { Lesson } from '@/entities/Lesson';
import { Slide } from '@/entities/Slide';

// Resolve locale fields from slide JSONB locales column
function resolveLocale(slide: Slide, lang: string) {
    const override = slide.locales?.[lang];
    if (!override) return slide;
    return {
        ...slide,
        title: override.title ?? slide.title,
        bulletPoints: override.bulletPoints ?? slide.bulletPoints,
        note: override.note ?? slide.note,
    };
}

export async function getAllCourses() {
    try {
        const ds = await getDataSource();
        const courses = await ds.getRepository(Course).find({
            relations: ['lessons'],
            order: { title: 'ASC' },
        });
        return courses.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            lessons: c.lessons.sort((a, b) => a.order - b.order),
        }));
    } catch (e) {
        console.error('[getAllCourses]', e);
        return [];
    }
}

export async function getCourse(id: string) {
    try {
        const ds = await getDataSource();
        const course = await ds.getRepository(Course).findOne({
            where: { id },
            relations: ['lessons'],
        });
        if (!course) return null;
        return {
            ...course,
            lessons: course.lessons.sort((a, b) => a.order - b.order),
        };
    } catch (e) {
        console.error('[getCourse]', e);
        return null;
    }
}

export async function getLessons(courseId: string) {
    try {
        const ds = await getDataSource();
        const lessons = await ds.getRepository(Lesson).find({
            where: { courseId },
            order: { order: 'ASC' },
        });
        return lessons;
    } catch (e) {
        console.error('[getLessons]', e);
        return [];
    }
}

export async function getLessonSlides(lessonId: string, lang = 'en') {
    try {
        const ds = await getDataSource();
        const slides = await ds.getRepository(Slide).find({
            where: { lessonId },
            order: { slideOrder: 'ASC' },
        });
        return slides.map((s) => resolveLocale(s, lang));
    } catch (e) {
        console.error('[getLessonSlides]', e);
        return [];
    }
}
