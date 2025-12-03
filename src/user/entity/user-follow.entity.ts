import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "user_follow" })
export class UserFollow {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "following_user_id" })
  followingUser: User;

  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "followed_user_id" })
  followedUser: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}