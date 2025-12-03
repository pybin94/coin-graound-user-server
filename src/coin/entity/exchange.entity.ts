import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CoinExchange } from "./coin-exchange.entity";

@Entity({ name: "exchange" })
export class Exchange {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "korean_name", comment: "거래소 이름 한글" })
    koreanName: string;

    @Column({ name: "english_name", comment: "거래소 이름 영문" })
    englishName: string;

    @Column({ comment: "ticker prefix", nullable: true })
    prefix: string;

    @Column({ nullable: true })
    url: string;

    @Column({ comment: "거래소 화폐"})
    currency: string;

    @Column({ name: "extra_field", nullable: true })
    extraField: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @OneToMany(type => CoinExchange, coinExchange => coinExchange.exchange, { cascade: true })
    coinExchange: CoinExchange[];
}