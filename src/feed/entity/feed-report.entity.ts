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
  
  @Column({ type: "smallint", comment: "신고사유 1: 도배, 2: 욕설, 3: 광고, 4: 부적절한 글" })
  type: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}