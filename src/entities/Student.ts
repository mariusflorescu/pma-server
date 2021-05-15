import {Entity, Column, ManyToOne, ManyToMany, OneToOne, OneToMany} from "typeorm";
import Application from "./Application";
import Project from "./Project";
import User from './User'
import Task from "./Task";

@Entity("students")
export default class Student extends User {
    constructor(student: Partial<Student>){
        super(student);
        Object.assign(this,student);
    }

  @Column()
  firstname:string;
  
  @Column()
  lastname:string;

  @Column({nullable:true,type:'text'})
  description:string;

  @Column()
  github_username:string;

  @ManyToOne(() => Project, project => project.team)
  project: Project;

  @OneToMany(() => Application, application => application.student)
  applicant: Application;

  @ManyToOne(() => Task, task => task.student)
  tasks: Task[];
}
