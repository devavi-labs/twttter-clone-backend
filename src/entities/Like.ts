import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quack } from "./Quack";
import { User } from "./User";

@Entity()
@ObjectType()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  quackId: number;

  @ManyToOne(() => Quack, (quack) => quack.likes)
  @Field(() => Quack)
  quack: Quack;

  @Column()
  @Field()
  userId: number;

  @ManyToOne(() => User, (user) => user.likes)
  @Field(() => User)
  user: User;
}
