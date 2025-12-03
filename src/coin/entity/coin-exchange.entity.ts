import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Coin } from "./coin.entity";
import { Exchange } from "./exchange.entity";

@Entity({ name: "coin_exchange" })
export class CoinExchange {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Coin, coin => coin.id, {onDelete: "CASCADE",})    
    @JoinColumn({ name: "coin_id" })
    coin: Coin;

    @ManyToOne(type => Exchange, exchange => exchange.id, {onDelete: "CASCADE",})
    @JoinColumn({ name: "exchange_id" })
    exchange: Exchange;

    @Column({ comment: "종목 구분 코드" })
    ticker: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;  

    @Column({ name: "is_delisted", default: false, comment: "상장 폐지 유무" })
    isDelisted: boolean;
}