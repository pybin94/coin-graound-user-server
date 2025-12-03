import { Controller, Body, Post, Patch, Req, Delete, Get, Query } from '@nestjs/common';
import { CoinService } from './coin.service';
import { GetExchangeDto } from './dto/get-exchange.dto';
import { ResponseFormat } from 'src/config/config.model';

@Controller('coin')
export class CoinController {
    constructor( 
        private readonly coinService: CoinService
    ) {}

    @Get("/")
    async getCoins(@Body() body: any): Promise<ResponseFormat> {
        const getCoins = await this.coinService.getCoins(body);
        return getCoins;
    }

    @Get("/exchanges")
    async getExchanges(@Query() query: GetExchangeDto): Promise<ResponseFormat> {
        const getExchanges = await this.coinService.getExchanges(query);
        return getExchanges;
    }

    @Get("/coin-exchange")
    async getCoinExchange(@Query() query: GetExchangeDto): Promise<ResponseFormat> {
        const getCoinExchange = await this.coinService.getCoinExchange(query);
        return getCoinExchange;
    }
}