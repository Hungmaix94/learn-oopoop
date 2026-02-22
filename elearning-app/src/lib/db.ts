import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Course } from '@/entities/Course';
import { Lesson } from '@/entities/Lesson';
import { Slide } from '@/entities/Slide';

// Singleton pattern for Next.js — preserves the connection across hot-reloads in dev
declare global {
    // eslint-disable-next-line no-var
    var _typeormDataSource: DataSource | undefined;
}

const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for Supabase
    entities: [Course, Lesson, Slide],
    synchronize: false, // never use true in production
    logging: process.env.NODE_ENV === 'development',
});

export async function getDataSource(): Promise<DataSource> {
    if (global._typeormDataSource?.isInitialized) {
        return global._typeormDataSource;
    }

    const ds = await AppDataSource.initialize();
    global._typeormDataSource = ds;
    return ds;
}

export { AppDataSource };
