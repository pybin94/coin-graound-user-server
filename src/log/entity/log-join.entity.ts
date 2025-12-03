import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "log_join" })
export class LogJoin {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(type => User, user => user.id, {onDelete: "CASCADE",})
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "recommender_id", type: "integer", default: 0 })
  recommender: number;

  @Column({ name: "current_consecutive_count", type: "integer", default: 0 })
  currentConsecutiveCount: number;

  @Column({ name: "join_ip" })
  joinIp: string;

  @Column({ comment: "이전 페이지" })
  referer: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}