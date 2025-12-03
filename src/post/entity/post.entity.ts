import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Board } from "src/board/entity/board.entity";
import { Comment } from "src/comment/entity/comment.entity";
import { PostMeta } from "./post-meta.entity";
import { PostVote } from "./post-vote.entity";
import { PostReport } from "./post-report.entity";
import { CommentReport } from "src/comment/entity/comment-report.entity";

@Entity({ name: "post" })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
    
  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "user_id" })
  user: User;
  
  @ManyToOne(type => Board, board => board.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "board_id" })
  board: Board;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: number;

  @Column({ name: "is_secret", type: "smallint", default: 0, comment: "0: 일반글, 1: 비밀글" })
  isSecret: number;

  @Column({ name: "is_notice", type: "smallint", default: 0, comment: "0: 일반글, 1: 고정글" })
  isNotice: number;

  @Column({ name: "view_count", type: "integer", default: 0 })
  viewCount: number;

  @Column({ name: "like_count", type: "integer", default: 0 })
  likeCount: number;

  @Column({ name: "dislike_count", type: "integer", default: 0 })
  dislikeCount: number;

  @Column({ name: "created_ip" })
  createdIp: string;

  @Column({ name: "thumbnail_url", nullable: true })
  thumbnailURL: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt: string;
  
  @Column({ name: "blocked_at", nullable: true })
  blockedAt: string;

  @OneToMany(type => Comment, comment => comment.post, { cascade: true })
  comment: Comment[];

  @OneToMany(type => PostMeta, postMeta => postMeta.post, { cascade: true })
  postMeta: PostMeta[];

  @OneToMany(type => PostVote, postVote => postVote.post, { cascade: true })
  postVote: PostVote[];

  @OneToMany(type => PostReport, postReport => postReport.post, { cascade: true })
  postReport: PostReport[];

  @OneToMany(type => CommentReport, commentReport => commentReport.post, { cascade: true })
  commentReport: CommentReport[];
}