import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Lesson } from './Lesson';

@Entity('slides')
export class Slide {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'lesson_id' })
    lessonId!: string;

    @Column()
    title!: string;

    @Column({ name: 'bullet_points', type: 'jsonb', nullable: true })
    bulletPoints!: string[];

    @Column({ name: 'code_example', type: 'text', nullable: true })
    codeExample!: string | null;

    @Column({ type: 'text', nullable: true })
    note!: string | null;

    @Column({ name: 'slide_order', default: 0 })
    slideOrder!: number;

    @Column({ type: 'jsonb', nullable: true })
    locales!: Record<string, { title?: string; bulletPoints?: string[]; note?: string }> | null;

    @ManyToOne('Lesson', (lesson: any) => lesson.slides)
    @JoinColumn({ name: 'lesson_id' })
    lesson!: Lesson;
}
