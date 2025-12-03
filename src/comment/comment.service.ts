import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { DataSource } from 'typeorm';
import { ResponseStatus } from 'src/config/config.model';

@Injectable()
export class CommentService {
    private title = "CommentService"

    constructor(
        private readonly datasource: DataSource,
        private readonly commentRepository: CommentRepository,
    ) {}

    async getComments(body: any): Promise<object> {
        try{
            const getComments = await this.commentRepository.getComments(body)
            return handleSend(getComments)
        } catch (error) {
            return handleError({
                title: `[${this.title}] getComments`, 
                error,
            })
        }
    };

    async createComment(body: any, token: any, req: Request): Promise<object> {
        const queryRunner = this.datasource.createQueryRunner()

        try{
            await queryRunner.connect();
            await queryRunner.startTransaction();

            await this.commentRepository.createComment(body, token, req, queryRunner)
            await queryRunner.commitTransaction()
            
            return handleSend({})
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return handleError({
                title: `[${this.title}] createComment`, 
                error,
            })
        } finally {
            await queryRunner.release();
        }
    }

    async deleteComment(body: any, token: any): Promise<object> {
        try{
            const authCommentCheck = await this.commentRepository.getComment(body)
            body["parentId"] = authCommentCheck.parent_id
            if (authCommentCheck.user_id !== token.id) {
                return handleSend({
                    description: "권한이 없습니다.", 
                    statusCode: ResponseStatus.ERROR,
                })
            }
            await this.commentRepository.deleteComment(body, token)
            return handleSend({
                description: "삭제되었습니다.",
            })
        } catch (error) {
            return handleError({
                title: `[${this.title}] deleteComment`, 
                error,
            })
        }
    }
}