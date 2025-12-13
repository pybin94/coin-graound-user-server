import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Post, Req, Patch, Get, Query, Delete } from '@nestjs/common';
import { FeedService } from './feed.service';
import { GetFeedDto, GetMyFeedDto, ReportFeedDto } from './dto/get-feed.dto';
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
    @Post('/mypage')
    async getMyFeed(@Body() body: GetMyFeedDto, @Token() token: any): Promise<ResponseFormat> {
        const getMyFeed = await this.feedService.getMyFeed(body, token);
        return getMyFeed;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/mypage')
    async deleteMyFeed(@Body() body: any, @Token() token: any): Promise<ResponseFormat> {
        const deleteMyFeed = await this.feedService.deleteMyFeed(body, token);
        return deleteMyFeed;
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

    @UseGuards(JwtAuthGuard)
    @Post('/report')
    async reportFeed(@Body() body: ReportFeedDto, @Token() token: any): Promise<ResponseFormat> {
        console.log(body)
        const reportFeed = await this.feedService.reportFeed(body, token);
        return reportFeed;
    }
}