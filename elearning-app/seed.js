import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js'

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for seeding!

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    try {
        console.log('Seeding Course via REST API...');
        const dataDir = path.join(process.cwd(), '../generated_data');
        const courseJson = JSON.parse(fs.readFileSync(path.join(dataDir, 'course.json'), 'utf8')).course;

        // Attempting to delete existing data (might fail if tables don't exist yet but let's try)
        await supabase.from('slides').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('lessons').delete().neq('id', 'temp');
        await supabase.from('courses').delete().neq('id', 'temp');

        console.log('Uploading Courses...')
        const { error: courseErr } = await supabase.from('courses').insert({
            id: 'backend-engineering',
            title: courseJson.title,
            description: courseJson.description
        });
        if (courseErr) { console.error('Course insert error:', courseErr.message); return; }

        const lessonsData = courseJson.lessons.map(l => ({
            id: l.lessonId,
            course_id: 'backend-engineering',
            title: l.lessonTitle,
            summary: l.summary,
            order: l.order
        }));

        console.log('Uploading Lessons...')
        const { error: lessonsErr } = await supabase.from('lessons').insert(lessonsData);
        if (lessonsErr) { console.error('Lessons insert error:', lessonsErr.message); return; }

        const slideFiles = [
            'lesson-1-slides.json',
            'lesson-2-slides.json',
            'lesson-3-slides.json',
            'lesson-4-slides.json'
        ];

        console.log('Uploading Slides...')
        for (const file of slideFiles) {
            const slideData = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
            const lessonId = slideData.lessonId;

            const slidesToInsert = slideData.slides.map(s => ({
                lesson_id: lessonId,
                title: s.title,
                bullet_points: JSON.stringify(s.bulletPoints), // or just s.bulletPoints if column is JSONB
                code_example: s.codeExample,
                note: s.note,
                order: s.slideOrder
            }));

            const { error: slideErr } = await supabase.from('slides').insert(slidesToInsert);
            if (slideErr) console.error(`Slides insert error for ${lessonId}:`, slideErr.message);
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding DB via REST API:', error);
    }
}

run();
