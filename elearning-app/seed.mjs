/**
 * Seed script — creates tables via raw SQL and inserts all course/lesson/slide data.
 * Run: node --env-file=.env.local seed.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../generated_data');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function run() {
    const client = await pool.connect();
    console.log('✅ Connected to Supabase');

    try {
        // ── Create tables ───────────────────────────────────────────────────
        await client.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id          VARCHAR(200) PRIMARY KEY,
                title       VARCHAR(500) NOT NULL,
                description TEXT
            );

            CREATE TABLE IF NOT EXISTS lessons (
                id           VARCHAR(200) PRIMARY KEY,
                course_id    VARCHAR(200) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
                title        VARCHAR(500) NOT NULL,
                summary      TEXT,
                lesson_order INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS slides (
                id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                lesson_id     VARCHAR(200) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
                title         VARCHAR(500) NOT NULL,
                bullet_points JSONB,
                code_example  TEXT,
                note          TEXT,
                slide_order   INTEGER DEFAULT 0,
                locales       JSONB
            );
        `);
        console.log('🔧 Tables ready');

        // ── Clear existing data ─────────────────────────────────────────────
        await client.query('DELETE FROM slides');
        await client.query('DELETE FROM lessons');
        await client.query('DELETE FROM courses');
        console.log('🗑️  Cleared existing data');

        // ── Seed all courses ────────────────────────────────────────────────
        const courseFiles = fs.readdirSync(dataDir)
            .filter(f => f.startsWith('course') && f.endsWith('.json'));

        for (const file of courseFiles) {
            const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
            const courseData = raw.course;
            const courseId = file === 'course.json'
                ? 'backend-engineering'
                : file.replace('course-', '').replace('.json', '');

            await client.query(
                'INSERT INTO courses (id, title, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
                [courseId, courseData.title, courseData.description ?? null]
            );

            for (const l of courseData.lessons) {
                await client.query(
                    `INSERT INTO lessons (id, course_id, title, summary, lesson_order)
                     VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
                    [l.lessonId, courseId, l.lessonTitle, l.summary ?? null, l.order ?? 0]
                );
            }
            console.log(`📦 ${courseId}: ${courseData.lessons.length} lessons`);
        }

        // ── Seed all slides ─────────────────────────────────────────────────
        const slideFiles = fs.readdirSync(dataDir).filter(f => f.includes('-slides.json'));
        let total = 0;

        for (const file of slideFiles) {
            const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
            const lessonId = raw.lessonId;

            for (const s of raw.slides) {
                await client.query(
                    `INSERT INTO slides (lesson_id, title, bullet_points, code_example, note, slide_order, locales)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        lessonId,
                        s.title,
                        JSON.stringify(s.bulletPoints ?? []),
                        s.codeExample ?? null,
                        s.note ?? null,
                        s.slideOrder ?? 0,
                        s.locales ? JSON.stringify(s.locales) : null,
                    ]
                );
                total++;
            }
            console.log(`   🖼️  ${lessonId}: ${raw.slides.length} slides`);
        }

        console.log(`\n✅ Done! ${courseFiles.length} courses, ${total} slides seeded to Supabase.`);
    } finally {
        client.release();
        await pool.end();
    }
}

run().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
