import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Coin } from "src/coin/entity/coin.entity";

@Entity({ name: "feed" })
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;
    
  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "user_id" })
  user: User;
  
  @ManyToOne(type => Coin, coin => coin.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "coin_id" })
  coin: Coin;

  @Column({ type: "text" })
  content: number;

  @Column({ type: "text", comment: "피드 작성시 코인 가격", nullable: false })
  price: string;

  @Column({ name: "like_count", type: "integer", default: 0 })
  likeCount: number;

  @Column({ name: "dislike_count", type: "integer", default: 0 })
  dislikeCount: number;

  @Column({ name: "created_ip" })
  createdIp: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt: string;
  
  @Column({ name: "blocked_at", nullable: true })
  blockedAt: string;
}