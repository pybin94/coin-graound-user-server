import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Feed } from "./feed.entity";

@Entity({ name: "feed_vote" })
export class FeedVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Feed, feed => feed.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "feed_id" })
  feed: Feed;
  
  @Column({ type: "smallint", comment: "1: like, 2: dislike", default: 1 })
  type: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}