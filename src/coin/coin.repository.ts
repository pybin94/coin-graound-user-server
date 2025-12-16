import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coin } from './entity/coin.entity';
import got from 'got';
import { CoinExchange } from './entity/coin-exchange.entity';
import { Exchange } from './entity/exchange.entity';
import { GetExchangeDto } from './dto/get-exchange.dto';

@Injectable()
export class CoinRepository {
    constructor(
        @InjectRepository(Coin)
        private readonly coinRepository: Repository<Coin>,

        @InjectRepository(Exchange)
        private readonly exchangeRepository: Repository<Exchange>,

        @InjectRepository(CoinExchange)
        private readonly coinExchangeRepository: Repository<CoinExchange>,
    ) {
        // this.setCoins(false);
        // this.setExchange(false);
    };

    async getCoins(body: any): Promise<Coin[]> {
        const getCoins = await this.coinRepository.createQueryBuilder("coin")
            .select()
            .getMany();

        return getCoins;
    }
    
    async getCoinBySymbol(symbol: string): Promise<Coin> {
        const getCoinBySymbol = await this.coinRepository.createQueryBuilder("coin")
            .select()
            .where("coin.symbol = :symbol", {symbol})
            .getOne();

        return getCoinBySymbol;
    }

    async getExchanges(query: GetExchangeDto): Promise<Exchange> {
        const { exchange } = query
        const getExchange = await this.exchangeRepository.createQueryBuilder("exchange")
            .select()
            .where('exchange.id = :id', {id: exchange})
            .getOne();

        return getExchange
    }

    async getCoinExchange(query: GetExchangeDto): Promise<{
        exchange: Exchange, 
        coinExchange: CoinExchange[]
    }> {
        const { exchange } = query;
        const getExchange = await this.getExchanges(query);
        const getCoinExchange = await this.coinExchangeRepository.createQueryBuilder("coinExchange")
            .select()
            .leftJoinAndSelect('coinExchange.coin', "coin")
            .where("coinExchange.exchange = :exchange", {exchange})
            .andWhere("coinExchange.isDelisted = :isDelisted", { isDelisted: false })
            .getMany();
        
        return {
            exchange: getExchange, 
            coinExchange: getCoinExchange
        };
    }
}