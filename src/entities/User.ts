import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DEFAULT_CP, DEFAULT_DP } from "../constants";
import { Follow } from "./Follow";
import { Like } from "./Like";
import { Quack } from "./Quack";
import { Requack } from "./Requack";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Column()
  @Field()
  displayName: string;

  @Column({ default: DEFAULT_DP })
  @Field()
  displayPicture: string = DEFAULT_DP;

  @Column({ default: DEFAULT_CP })
  @Field()
  coverPicture: string = DEFAULT_CP;

  @Column({ unique: true })
  rawUsername: string;

  @Column()
  @Field()
  username: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ type: "boolean", default: false })
  @Field()
  emailVerified: boolean = false;

  @Column({ type: "boolean", default: false })
  @Field()
  amIDeactivated: boolean = false;

  @Column()
  password: string;

  @OneToMany(() => Quack, (quack) => quack.quackedByUser, { nullable: true })
  @Field(() => [Quack], { nullable: true })
  quacks: Quack[];

  @OneToMany(() => Requack, (requack) => requack.user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Requack], { nullable: true })
  requacks: Requack[];

  @OneToMany(() => Like, (like) => like.user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Like], { nullable: true })
  likes: Like[];

  @OneToMany(() => Follow, (follow) => follow.user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Follow], { nullable: true })
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Follow], { nullable: true })
  followings: Follow[];

  @Field(() => Boolean, { nullable: true })
  haveIBlockedThisUser: Boolean;

  @Field(() => Boolean, { nullable: true })
  amIBlockedByThisUser: Boolean;

  @Field(() => Boolean, { nullable: true })
  followStatus: Boolean;

  @Field(() => Boolean, { nullable: true })
  followBackStatus: Boolean;
}
