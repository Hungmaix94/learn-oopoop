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
            // Determine the course id from the filename, e.g., 'course-nestjs.json' -> 'nestjs'
            // If the file is 'course.json', default to 'backend-engineering'.
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

export async function getLessonSlides(lessonId: string) {
    try {
        const fileTarget = `lesson-${lessonId.split('-')[1] || lessonId}-slides.json`;
        const fallbackDir = path.join(getDataDir(), fileTarget);
        // Fallback naive matching if IDs slightly differ from the manual map I made earlier
        const files = fs.readdirSync(getDataDir()).filter(f => f.includes('slides.json'));

        // Scan all slides JSONs to find the appropriate lesson ID
        for (const file of files) {
            const raw = fs.readFileSync(path.join(getDataDir(), file), 'utf8');
            const data = JSON.parse(raw);
            if (data.lessonId === lessonId) {
                return data.slides.sort((a: any, b: any) => a.slideOrder - b.slideOrder);
            }
        }
        return [];
    } catch (e) {
        return [];
    }
}
