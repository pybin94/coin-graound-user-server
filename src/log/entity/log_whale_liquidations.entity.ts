import { Exchange } from 'src/coin/coin.model';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('log_whale_liquidations')
export class LogWhaleLiquidation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({comment: "비트코인: 1, 이더리움: 2, 리플: 3, BNB: 4, 솔라나: 5, 도지코인: 6, 트론: 7"})
  symbol: number;

  @Column({ comment: "매도: 0, 매수: 1"})
  side: number;

  @Column('decimal', { precision: 20, scale: 2, comment: "청산된 가격"})
  price: number;

  @Column('decimal', { precision: 20, scale: 2, comment: "청산된 수량"})
  quantity: number;

  @Column('decimal', { precision: 20, scale: 2, comment: "가격 * 수량"})
  notional: number;

  @Column({ type: "integer", comment: "업비트: 1, 빗썸: 2, 바이낸스: 3, 바이비트: 4, OKX: 5, 코인베이스: 6"})
  exchange: Exchange;

  @Column()
  timestamp: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}