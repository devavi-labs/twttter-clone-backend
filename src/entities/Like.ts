import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Quack } from "./Quack";
import { User } from "./User";

@Entity()
@ObjectType()
export class Like extends BaseEntity {
  @PrimaryColumn({ type: "text" })
  @Field()
  quackId: string;

  @ManyToOne(() => Quack, (quack) => quack.likes)
  @Field(() => Quack)
  quack: Quack;

  @Column()
  @Field()
  userId: string;

  @ManyToOne(() => User, (user) => user.likes)
  @Field(() => User)
  user: User;
}
