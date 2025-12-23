import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Post, Req, Patch, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createPost(@Body() body: any, @Token() token: any, @Req() req: Request, @Query() query: any): Promise<object> {
        const createPost = await this.postService.createPost(body, token, req, query);
        return createPost;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/list')
    async postList(@Body() body: any, @Token(false) token: any, @Query() query: any): Promise<object> {
        const postList = await this.postService.postList(body, token, query);
        return postList;
    }

    @Post('/')
    async getPost(@Body() body: any): Promise<object> {
        const getPost = await this.postService.getPost(body);
        return getPost;
    }

    @Patch('/view-count')
    async updateViewCount(@Body() body: any): Promise<object> {
        const getPost = await this.postService.updateViewCount(body);
        return getPost;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/')
    async updatePost(@Body() body: any, @Token() token: any): Promise<object> {
        const getPost = await this.postService.updatePost(body, token);
        return getPost;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/vote')
    async voteLikeCount(@Body() body: any, @Token() token: any): Promise<object> {
        const getPost = await this.postService.voteLikeCount(body, token);
        return getPost;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/image')
    async uploadImage(@Body() body: any): Promise<object> {
        const uploadImage = await this.postService.uploadImage(body);
        return uploadImage;
    }
}