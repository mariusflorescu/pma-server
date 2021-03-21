import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import bcrypt from 'bcrypt'
import {Entity, Column, BeforeInsert, Index} from "typeorm";
import IEntity from './IEntity'

@Entity()
export default abstract class User extends IEntity {
    constructor(user: Partial<User>){
        super();
        Object.assign(this,user);
    }
  
  @Index()
  @Length(3,16,{message:'Must be at least 3 characters long'})
  @Column({unique: true})
  username:string;
  
  @Index()
  @IsEmail(undefined,{message:'Must be a valid email'})
  @Length(1,255,{message:'Must not be empty'})
  @Column({unique:true})
  email:string;
  
  @Exclude()
  @Column()
  @Length(6,24,{message:'Must be at least 6 characters long'})
  password:string;

  @BeforeInsert()
    async encryptPassword(){
          this.password = await bcrypt.hash(this.password,8);
    }
}
