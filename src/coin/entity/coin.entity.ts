import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CoinExchange } from "./coin-exchange.entity";

@Entity({ name: "coin" })
export class Coin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "symbol", unique: true })
    symbol: string;

    @Column({ name: "korean_name", nullable: true })
    koreanName: string;

    @Column({ name: "english_name", nullable: true })
    englishName: string;

    @Column({ name: "extra_fild", nullable: true })
    extraField: string;
    
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;  

    @OneToMany(type => CoinExchange, coinExchange => coinExchange.coin, { cascade: true })
    coinExchange: CoinExchange[];
}