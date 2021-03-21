import bcrypt from 'bcrypt'
import {Entity, Column, BeforeInsert} from "typeorm";
import User from './User'

@Entity("company")
export default class Company extends User {
    constructor(company: Partial<Company>){
        super(company);
        Object.assign(this,company);
    }
  
  @Column()
  name:string;

  @Column({nullable:true,type:'text'})
  description:string;

  @Column()
  website:string;

  @BeforeInsert()
  async encryptPassword(){
        this.password = await bcrypt.hash(this.password,8);
  }
}
