import 'reflect-metadata';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import type { Lesson } from './Lesson';

@Entity('courses')
export class Course {
    @PrimaryColumn()
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description!: string;

    @OneToMany('Lesson', (lesson: any) => lesson.course)
    lessons!: Lesson[];
}
