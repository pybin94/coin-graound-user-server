import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Get, Post } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
    constructor( 
        private readonly NewsService: NewsService
    ) {}

    @Post('/list')
    async newsList(@Body() body: any): Promise<object> {
        const newsList = await this.NewsService.newsList(body);
        return newsList;
    }
}