import 'reflect-metadata';
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { Course } from './Course';
import type { Slide } from './Slide';

@Entity('lessons')
export class Lesson {
    @PrimaryColumn()
    id!: string;

    @Column({ name: 'course_id' })
    courseId!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    summary!: string;

    @Column({ name: 'lesson_order', default: 0 })
    order!: number;

    @ManyToOne('Course', (course: any) => course.lessons)
    @JoinColumn({ name: 'course_id' })
    course!: Course;

    @OneToMany('Slide', (slide: any) => slide.lesson)
    slides!: Slide[];
}
