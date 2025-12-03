import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Comment } from "./comment.entity";

@Entity({ name: "comment_vote" })
export class CommentVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Comment, comment => comment.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "comment_id" })
  comment: Comment;
  
  @Column({ type: "smallint" })
  type: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}