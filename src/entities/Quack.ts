import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Like } from "./Like";
import { Link } from "./Link";
import { Requack } from "./Requack";
import { User } from "./User";

@Entity()
@ObjectType()
export class Quack extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column({ type: "boolean", default: true })
  @Field()
  isVisible: boolean = true;

  @Column()
  @Field()
  text: string;

  @Field(() => String, { nullable: true })
  truncatedText: string;

  @Field(() => [Link], { nullable: true })
  links: Link[] | null;

  @Field(() => [User], { nullable: true })
  mentions: User[] | null;

  @Field(() => [String], { nullable: true })
  hashtags: string[] | null;

  @Column()
  @Field()
  quackedByUserId: number;

  @ManyToOne(() => User, (user) => user.quacks)
  @Field(() => User)
  quackedByUser: User;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  inReplyToQuackId: number;

  @ManyToOne(() => Quack, (quack) => quack.replies, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @Field(() => Quack, { nullable: true })
  inReplyToQuack: Quack;

  @Field(() => Int, { defaultValue: 0 })
  replies: number = 0;

  @Field(() => Int, { defaultValue: 0 })
  requacks: number = 0;

  @Field(() => Int, { defaultValue: 0 })
  likes: number = 0;

  @ManyToOne(() => Like, (like) => like.userId, {
    onDelete: "CASCADE",
  })
  _likes: Quack[];

  @ManyToOne(() => Requack, (requack) => requack.userId, {
    onDelete: "CASCADE",
  })
  _requacks: Quack[];

  @Field(() => Boolean, { nullable: true })
  requackStatus: Boolean;

  @Field(() => Boolean, { nullable: true })
  likeStatus: Boolean;
}
