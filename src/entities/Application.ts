import { Entity, Column, Index, ManyToOne, JoinColumn, OneToMany, ManyToMany, OneToOne } from "typeorm"

import IEntity from './IEntity'
import Project from './Project'
import Student from "./Student";

@Entity("applications")
export default class Application extends IEntity{
  constructor(application: Partial<Application>){
    super();
    Object.assign(this,application);
  }

  @Index()
  @Column()
  status: string;

  @ManyToOne(() => Project, project => project.applicants,{onDelete:"CASCADE"})
  project: Project;

  @Column()
  username:string;

  @ManyToOne(() => Student, student => student.applicant)
  @JoinColumn({name:"username",referencedColumnName:"username"})
  student: Student;
}