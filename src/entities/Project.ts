import { Entity, Column, Index, ManyToOne, JoinColumn, OneToMany, JoinTable } from "typeorm"

import IEntity from './IEntity'
import Company from './Company'
import Student from "./Student";
import Application from "./Application";
import Task from "./Task";

@Entity("projects")
export default class Project extends IEntity{
  constructor(project: Partial<Project>){
    super();
    Object.assign(this,project);
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
  username:string;

  @ManyToOne(() => Company, company => company.projects)
  @JoinColumn({name:"username",referencedColumnName:"username"})
  company: Company;

  @OneToMany(() => Student, student => student.project, {onDelete: "CASCADE"})
  @JoinColumn()
  team: Student[]

  @OneToMany(() => Application, application => application.project)
  @JoinColumn()
  applicants: Application[]

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];
}