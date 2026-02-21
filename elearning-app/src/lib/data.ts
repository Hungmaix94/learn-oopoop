import fs from 'fs';
import path from 'path';

// Helper to simulate Database queries via Local JSON
const getDataDir = () => path.join(process.cwd(), '../generated_data');

export async function getAllCourses() {
    try {
        const files = fs.readdirSync(getDataDir()).filter(f => f.startsWith('course') && f.endsWith('.json'));
        const courses = files.map(file => {
            const raw = fs.readFileSync(path.join(getDataDir(), file), 'utf8');
            const data = JSON.parse(raw);
            const id = file === 'course.json' ? 'backend-engineering' : file.replace('course-', '').replace('.json', '');
            return { id, ...data.course };
        });
        return courses;
    } catch (e) {
        return [];
    }
}

export async function getCourse(id: string) {
    try {
        const courses = await getAllCourses();
        return courses.find(c => c.id === id) || null;
    } catch (e) {
        return null;
    }
}

export async function getLessons(courseId: string) {
    const course = await getCourse(courseId);
    if (!course) return [];
    return course.lessons.sort((a: any, b: any) => a.order - b.order);
}

/**
 * Resolves a locale-aware slide: if the slide has a `locales` object with
 * the target lang, merge those fields over the defaults (title, bulletPoints, note).
 * codeExample is always shared across locales.
 */
function resolveSlideLocale(slide: any, lang: string) {
    if (slide.locales && slide.locales[lang]) {
        return {
            ...slide,
            title: slide.locales[lang].title ?? slide.title,
            bulletPoints: slide.locales[lang].bulletPoints ?? slide.bulletPoints,
            note: slide.locales[lang].note ?? slide.note,
        };
    }
    return slide;
}

export async function getLessonSlides(lessonId: string, lang = 'en') {
    try {
        const files = fs.readdirSync(getDataDir()).filter(f => f.includes('slides.json'));

        for (const file of files) {
            const raw = fs.readFileSync(path.join(getDataDir(), file), 'utf8');
            const data = JSON.parse(raw);
            if (data.lessonId === lessonId) {
                const sorted = data.slides.sort((a: any, b: any) => a.slideOrder - b.slideOrder);
                return sorted.map((slide: any) => resolveSlideLocale(slide, lang));
            }
        }
        return [];
    } catch (e) {
        return [];
    }
}
