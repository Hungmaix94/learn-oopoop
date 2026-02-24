import 'reflect-metadata';
import { getDataSource } from './db';
import { Course } from '@/entities/Course';
import { Lesson } from '@/entities/Lesson';
import { Slide } from '@/entities/Slide';
import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '../generated_data');

// Standardize lesson fields for UI
function mapLesson(l: any) {
    const id = l.id || l.lessonId;
    const title = l.title || l.lessonTitle;
    return {
        id,
        lessonId: id,
        title,
        lessonTitle: title,
        summary: l.summary,
        order: l.order || l.lesson_order || 0
    };
}

// Resolve locale fields from slide JSONB locales column
function resolveLocale(slide: any, lang: string) {
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
            lessons: (c.lessons || [])
                .map(mapLesson)
                .sort((a: any, b: any) => a.order - b.order),
        }));
    } catch (e) {
        console.warn('[getAllCourses] TypeORM failed, trying Supabase client:', (e as Error).message);
        try {
            if (!supabase) throw new Error('Supabase client not initialized');
            const { data, error } = await supabase
                .from('courses')
                .select('*, lessons(*)')
                .order('title', { ascending: true });

            if (error) throw error;

            return (data || []).map((c: any) => ({
                id: c.id,
                title: c.title,
                description: c.description,
                lessons: (c.lessons || [])
                    .map(mapLesson)
                    .sort((a: any, b: any) => a.order - b.order),
            }));
        } catch (sErr) {
            console.warn('[getAllCourses] Supabase failed, falling back to local JSON:', (sErr as Error).message);
            const files = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('course') && f.endsWith('.json'));
            return files.map(file => {
                const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
                const c = raw.course;
                const id = file === 'course.json' ? 'backend-engineering' : file.replace('course-', '').replace('.json', '');
                return {
                    id,
                    title: c.title,
                    description: c.description,
                    lessons: (c.lessons || [])
                        .map(mapLesson)
                        .sort((a: any, b: any) => a.order - b.order)
                };
            });
        }
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
            lessons: (course.lessons || [])
                .map(mapLesson)
                .sort((a: any, b: any) => a.order - b.order),
        };
    } catch (e) {
        console.warn('[getCourse] TypeORM failed, trying Supabase client:', (e as Error).message);
        try {
            if (!supabase) throw new Error('Supabase client not initialized');
            const { data, error } = await supabase
                .from('courses')
                .select('*, lessons(*)')
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                ...data,
                lessons: (data.lessons || [])
                    .map(mapLesson)
                    .sort((a: any, b: any) => a.order - b.order),
            };
        } catch (sErr) {
            console.warn('[getCourse] Supabase failed, falling back to local JSON:', (sErr as Error).message);
            const filename = id === 'backend-engineering' ? 'course.json' : `course-${id}.json`;
            const filePath = path.join(DATA_DIR, filename);
            if (!fs.existsSync(filePath)) return null;
            const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const c = raw.course;
            return {
                id,
                title: c.title,
                description: c.description,
                lessons: (c.lessons || [])
                    .map(mapLesson)
                    .sort((a: any, b: any) => a.order - b.order)
            };
        }
    }
}

export async function getLessons(courseId: string) {
    try {
        const ds = await getDataSource();
        const lessons = await ds.getRepository(Lesson).find({
            where: { courseId } as any,
            order: { order: 'ASC' } as any,
        });
        return lessons.map(mapLesson);
    } catch (e) {
        console.warn('[getLessons] TypeORM failed, trying Supabase client:', (e as Error).message);
        try {
            if (!supabase) throw new Error('Supabase client not initialized');
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('course_id', courseId)
                .order('lesson_order', { ascending: true });

            if (error) throw error;
            return (data || []).map(mapLesson);
        } catch (sErr) {
            console.warn('[getLessons] Supabase failed, falling back to local JSON:', (sErr as Error).message);
            const course = await getCourse(courseId);
            return course?.lessons || [];
        }
    }
}

export async function getLessonSlides(lessonId: string, lang = 'en') {
    try {
        const ds = await getDataSource();
        const slides = await ds.getRepository(Slide).find({
            where: { lessonId } as any,
            order: { slideOrder: 'ASC' } as any,
        });
        return slides.map((s) => resolveLocale(s, lang));
    } catch (e) {
        console.warn('[getLessonSlides] TypeORM failed, trying Supabase client:', (e as Error).message);
        try {
            if (!supabase) throw new Error('Supabase client not initialized');
            const { data, error } = await supabase
                .from('slides')
                .select('*')
                .eq('lesson_id', lessonId)
                .order('slide_order', { ascending: true });

            if (error) throw error;
            return (data || []).map((s: any) => resolveLocale(s, lang));
        } catch (sErr) {
            console.warn('[getLessonSlides] Supabase failed, falling back to local JSON:', (sErr as Error).message);
            const filename = `lesson-${lessonId.split('-').pop()}-slides.json`;
            // Search for lesson-X-slides.json or specific naming patterns
            const allFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('-slides.json'));
            const file = allFiles.find(f => {
                const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
                return raw.lessonId === lessonId;
            });

            if (!file) return [];
            const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
            return (raw.slides || []).map((s: any) => resolveLocale(s, lang));
        }
    }
}
