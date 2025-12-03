import { Post } from "src/post/entity/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BoardMeta } from "./baord-meta.entity";

@Entity({ name: "board" })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "int", default: 0, comment: "게시글 쓰기 권한, 유저 / 관리자"})
  authourity: number;
 
  @Column({ type: "text", nullable: true })
  template: number;

  @Column({ name: "is_active_comment", type: "boolean", default: true })
  isEnabledComment: boolean;

  @OneToMany(type => Post, post => post.board, { cascade: true })
  post: Post[];

  @OneToMany(type => BoardMeta, boardMeta => boardMeta.board, { cascade: true })
  boardMeta: BoardMeta[];
}