import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm"

import IEntity from './IEntity'
import Student from "./Student";
import Project from "./Project";

@Entity("tasks")
export default class Task extends IEntity{
    constructor(task: Partial<Task>){
        super();
        Object.assign(this,task);
    }

    @Column()
    name: string;

    @Index()
    @Column()
    description: string;

    @Index()
    @Column()
    status: string;

    @Column()
    projectId: string;

    @Column()
    assignedTo: string;

    @ManyToOne(() => Project, project => project.tasks)
    @JoinColumn({name: "projectId", referencedColumnName: "id"})
    project: Project;

    @ManyToOne(() => Student, student => student.tasks)
    @JoinColumn({name: "assignedTo", referencedColumnName: "id"})
    student: Student;
}