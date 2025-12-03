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

    async setCoins(isKoreaExchange: boolean): Promise<Coin> {
        try {

            const upbit = "https://api.upbit.com/v1/market/all";
            const bithumb = "https://api.bithumb.com/v1/market/all"
            const binance = "https://api2.binance.com/api/v3/ticker/price"

            let response = await got(binance).json() as Array<object>;
            let coins;
            let symbol;

            let includes = isKoreaExchange ? "KRW-" : "USDT"
            let objectKey = isKoreaExchange ? "market" : "symbol"

            response.forEach(async (item)=>{

                try {
                    if(item[objectKey].includes(includes)) {
                        symbol = item[objectKey].replace(includes, "")
                        let createCoinData = {
                            symbol,
                        } as any

                        if (isKoreaExchange) {
                            createCoinData.koreanName = item["korean_name"]
                            createCoinData.englishName = item["english_name"]
                        }

                        if (!isKoreaExchange && item["price"] == 0) return;
                
                        const getCoins = await this.getCoinBySymbol(symbol)
                        if (!getCoins) {
                            await this.coinRepository.createQueryBuilder()
                                .insert()
                                .values(createCoinData)
                                .into(Coin)
                                .execute();

                            console.log("새로운 코인이 추가됨", symbol, item["korean_name"], item["english_name"])
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            })

            return coins;            
        } catch (error) {
            console.log("error", error)
        }
    }

    async setExchange(isKoreaExchange: boolean): Promise<void> {

        // exchange 등록
        // 업비트 url: wss://api.upbit.com/websocket/v1
        // 빗썸 url: wss://ws-api.bithumb.com/websocket/v1

        try {
            const markets = {
                upbit: {
                    id: 1,
                    url: "https://api.upbit.com/v1/market/all",
                },
                bithumb: {
                    id: 2,
                    url: "https://api.bithumb.com/v1/market/all",
                },
                binance: {
                    id: 3,
                    url: "https://api2.binance.com/api/v3/ticker/price"
                },
                binanceF: {
                    id: 4,
                    url: "https://fapi.binance.com/fapi/v1/ticker/price"
                },
            }

            let includes = isKoreaExchange ? "KRW-" : "USDT"
            let objectKey = isKoreaExchange ? "market" : "symbol"

            let url = markets.binanceF.url
            let exchangeId = markets.binanceF.id

            let response = await got(url).json() as Array<object>;

            const getExchange = await this.exchangeRepository.createQueryBuilder("exchange")
                .select()
                .where("exchange.id = :id", {id: exchangeId})
                .getOne();

            response.forEach(async (item)=>{
                let ticker = item[objectKey];

                try {
                    if(ticker.includes(includes)) {
                        let symbol = item[objectKey].replace(includes, "")

                        const getCoin = await this.coinRepository.createQueryBuilder("coin")
                            .select()
                            .where("coin.symbol = :symbol", {symbol})
                            .getOne();
            
                        if (getCoin) {

                            let coin = getCoin

                            const getCoinExchange = await this.coinExchangeRepository.createQueryBuilder("coinExchange")
                                .select()
                                .where("coinExchange.ticker = :ticker", {ticker})
                                .andWhere("coinExchange.exchange = :exchange", {exchange: exchangeId})
                                .getOne();

                            if(!getCoinExchange){
                                const createCoinData = {
                                    ticker,
                                    coin,
                                    exchange: getExchange,
                                }

                                await this.coinExchangeRepository.createQueryBuilder()
                                    .insert()
                                    .values(createCoinData)
                                    .into(CoinExchange)
                                    .execute();

                                console.log(`${getExchange.koreanName} 거래소 코인이 추가됨`, ticker)
                            }
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            })
         
        } catch (error) {
            console.log("error", error)
        }
    }
}