import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Post, Req, Patch, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { GetFeedDto } from './dto/get-feed.dto';
import { ResponseFormat } from 'src/config/config.model';

@Controller('feed')
export class FeedController {
    constructor( 
        private readonly feedService: FeedService
    ) {}

    @Get('/')
    async getFeed(@Query() query: GetFeedDto): Promise<ResponseFormat> {
        const getFeed = await this.feedService.getFeed(query);
        return getFeed;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createFeed(@Body() body: any, @Token() token: any, @Req() req: Request): Promise<ResponseFormat> {
        const createFeed = await this.feedService.createFeed(body, token, req);
        return createFeed;
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch('/')
    async updateFeed(@Body() body: any, @Token() token: any): Promise<ResponseFormat> {
        const updateFeed = await this.feedService.updateFeed(body, token);
        return updateFeed;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/vote')
    async voteLikeCount(@Body() body: any, @Token() token: any): Promise<ResponseFormat> {
        const voteLikeCount = await this.feedService.voteLikeCount(body, token);
        return voteLikeCount;
    }
}