import { DataSource, QueryRunner } from 'typeorm';
import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';
import { BoardRepository } from 'src/board/board.repository';
import { SiteRepository } from 'src/site/site.repository';
import { UserRepository } from 'src/user/user.repository';
import { PointLog, PointMemo, PointStauts } from 'src/log/log.model';
import { minuteCalculator, nowDate } from 'src/config/tools.config';
import { User } from 'src/user/entity/user.entity';
import { PostRepository } from './post.repository';
import { ResponseStatus } from 'src/config/config.model';

@Injectable()
export class PostService {
    private title = "PostService"

    constructor(
        private readonly datasource: DataSource,
        private readonly postRepository: PostRepository,
        private readonly boardRepository: BoardRepository,
        private readonly siteRepository: SiteRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async createPost(body: any, token: any, req: Request): Promise<object> {

        let queryRunner: QueryRunner;
        try{
            const site = await this.siteRepository.site();
            const user = await this.userRepository.user(body, token);
            if (user.lastPostAt) {
                if (minuteCalculator(user.lastPostAt, site.postingInterval) > nowDate()){
                    return handleSend({
                        description: `게시글을 자주 작성하실 수 없습니다.<br>등록 간격: ${site.postingInterval}초`, 
                        statusCode: ResponseStatus.ERROR,
                    })
                }
            }

            await this.userRepository.updateUser({
                id: token.id,
                lastPostAt: nowDate()
            } as User)

            const board = await this.boardRepository.board(body);
            body["boardId"] = board["board_id"];

            queryRunner = this.datasource.createQueryRunner()
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const pointLog = {
                to: token.id,
                point: site.postingPoint,
                statusCode: PointStauts.INCREASE,
                memo: PointMemo.POSTING,
            } as PointLog;

            const postId = await this.postRepository.createPost(queryRunner, body, token, req);
            await queryRunner.commitTransaction();
  
            return handleSend({
                data: {postId}
            })
        } catch (error) {
            if(queryRunner) await queryRunner.rollbackTransaction();
            return handleError({
                title: `[${this.title}] createPost`, 
                error,
            });
        } finally {
            if (queryRunner) await queryRunner.release();
        }
    }

    async postList(body: any, token: any): Promise<object> {
        try{
            const board = await this.boardRepository.board(body)
            body["boardId"] = board["board_id"]
            body["boardType"] = board["boardMeta_type"]

            const postList = await this.postRepository.postList(body, token)

            return handleSend({data: postList})
        } catch (error) {
            return handleError({
                title: `[${this.title}] postList`, 
                error,

            })
        }
    }

    async getPost(body: any): Promise<object> {
        try{
            const getPost = await this.postRepository.getPost(body)
            return handleSend({
                data: getPost
            })
        } catch (error) {
            return handleError({
                title: `[${this.title}] getPost`, 
                error,
            })
        }
    }

    async updatePost(body: any, token: any): Promise<object> {
        try{
            const postData = await this.postRepository.getPost(body)
            if(token.id !== postData["user"]["id"]) {
                return handleSend({
                    description: "권한이 없습니다.", 
                    statusCode: ResponseStatus.ERROR,
                })
            }
            const updatePost = await this.postRepository.updatePost(body, token)

            return handleSend({
                data: updatePost
            })
        } catch (error) {
            return handleError({
                title: `[${this.title}] updatePost`, 
                error,
            })
        }
    }
    
    async updateViewCount(body: any): Promise<object> {
        try{
            await this.postRepository.updateViewCount(body)
            return handleSend({})
        } catch (error) {
            return handleError({
                title: `[${this.title}] updateViewCount`, 
                error,
            })
        }
    }

    async voteLikeCount(body: any, token: any): Promise<object> {
        try{
            const getVote = await this.postRepository.getVote(body, token)
            if (getVote) {
                return handleSend({
                    description: "이미 추천했습니다.", 
                    statusCode: ResponseStatus.ERROR,
                })
            }

            await this.postRepository.createVote(body, token)
            await this.postRepository.voteLikeCount(body)
            return handleSend({})
        } catch (error) {
            return handleError({
                title: `[${this.title}] voteLikeCount`,
                error,
            })
        }
    }
}