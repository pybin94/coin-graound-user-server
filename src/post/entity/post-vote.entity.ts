import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Post } from "./post.entity";

@Entity({ name: "post_vote" })
export class PostVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Post, post => post.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "post_id" })
  post: Post;
  
  @Column({ type: "smallint", comment: "1: like, 2: dislike" })
  type: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}