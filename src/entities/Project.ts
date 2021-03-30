import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm"

import IEntity from './IEntity'
import Company from './Company'

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

  @ManyToOne(() => Company, company => company.projects)
  @JoinColumn()
  company: Company;
}