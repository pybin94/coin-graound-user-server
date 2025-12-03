import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Feed } from "./feed.entity";

@Entity({ name: "feed_report" })
export class FeedReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Feed, feed => feed.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "feed_id" })
  feed: Feed;
  
  @Column({ type: "text", comment: "신고사유" })
  content: string;

  @Column({ type: "smallint", default: 0 })
  status: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}