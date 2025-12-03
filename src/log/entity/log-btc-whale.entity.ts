import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "log_btc_whale" })
export class LogBtcWhale {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: "integer" })
  amount: number;

  @Column({ type: "varchar" })
  hash: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}