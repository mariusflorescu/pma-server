import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn} from "typeorm";
import {classToPlain} from 'class-transformer'

@Entity()
export default abstract class IEntity extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt:Date;

    toJSON(){
      return classToPlain(this);
    }
}
