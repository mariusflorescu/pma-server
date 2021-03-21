import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {classToPlain} from 'class-transformer'

@Entity()
export default class IEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    createdAt:Date;

    toJSON(){
      return classToPlain(this);
    }
}
