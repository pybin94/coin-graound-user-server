import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Get, Post, Patch, Req, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor( 
        private readonly commentService: CommentService
    ) {}

    @Post("/")
    async getComments(@Body() body: any): Promise<any> {
        const getComments = await this.commentService.getComments(body);
        return getComments;
    }

    @UseGuards(JwtAuthGuard)
    @Post("/create")
    async createComment(@Body() body: any, @Token() token: any, @Req() req: Request): Promise<object> {
        const createComment = await this.commentService.createComment(body, token, req);
        return createComment;
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/")
    async patchComment(@Body() body: any, @Token() token: any): Promise<object> {
        return;
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/")
    async deleteComment(@Body() body: any, @Token() token: any): Promise<object> {
        const deleteComment = await this.commentService.deleteComment(body, token);
        return deleteComment;
    }
}