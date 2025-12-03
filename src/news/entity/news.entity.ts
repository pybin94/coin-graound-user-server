import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "news" })
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "post_id", unique: true })
  postId: string;

  @Column({ type: "text", nullable: true })
  text: string;

  @Column({ type: "text", nullable: true })
  images: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt: string;
}