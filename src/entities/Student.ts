import {Entity, Column} from "typeorm";
import User from './User'

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
}
