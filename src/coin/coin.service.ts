import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';
import { CoinRepository } from './coin.repository';
import { GetExchangeDto } from './dto/get-exchange.dto';
import { ResponseFormat } from 'src/config/config.model';

@Injectable()
export class CoinService {
    private title = "CoinService"

    constructor(
        private readonly coinRepository: CoinRepository,
    ) {}

    async getCoins(body: any): Promise<ResponseFormat> {
        try{
            const getCoins = await this.coinRepository.getCoins(body)
            return handleSend({
                data: getCoins,
            })
        } catch (error) {
            return handleError({
                title: `[${this.title}] getCoins`, 
                error, 
            })
        }
    };

    async getExchanges(query: GetExchangeDto): Promise<ResponseFormat> {
        try{
            const getExchanges = await this.coinRepository.getExchanges(query)
            return handleSend({
                data: getExchanges,
            })
        } catch (error) {
            return handleError({
                title: `[${this.title}] getExchanges`, 
                error, 
            })
        }
    };

    async getCoinExchange(query: GetExchangeDto): Promise<ResponseFormat> {
        try{
            const getCoinExchange = await this.coinRepository.getCoinExchange(query)
            return handleSend({
                data: getCoinExchange,
            })
        } catch (error) {
            return handleError({
                title: `[${this.title}] getCoinExchange`, 
                error,
            })
        }
    };
}