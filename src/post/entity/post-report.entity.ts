import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Post } from "./post.entity";

@Entity({ name: "post_report" })
export class PostReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Post, post => post.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "post_id" })
  post: Post;
  
  @Column({ type: "text", comment: "신고사유" })
  content: string;

  @Column({ type: "smallint", default: 0 })
  status: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}