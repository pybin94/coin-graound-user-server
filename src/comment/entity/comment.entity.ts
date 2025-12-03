import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Post } from "src/post/entity/post.entity";

@Entity({ name: "comment" })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
    
  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",}) 
  @JoinColumn({ name: "user_id" })
  user: User;
    
  @ManyToOne(type => Post, post => post.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "post_id" })
  post: Post;
    
  @ManyToOne(type => Comment, comment => comment.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "parent_id" })
  parent: Comment;

  @Column({ type: "text" })
  content: number;

  @Column({ name: "created_ip" })
  createdIp: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt: string;
  
  @Column({ name: "blocked_at", nullable: true })
  blockedAt: string;

  @OneToMany(type => Comment, comment => comment.parent, { cascade: true })
  children: Comment[];
}