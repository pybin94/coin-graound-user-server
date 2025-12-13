import { VoteType } from './feed.model';
import { DataSource, QueryRunner } from 'typeorm';
import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';
import { BoardRepository } from 'src/board/board.repository';
import { SiteRepository } from 'src/site/site.repository';
import { UserRepository } from 'src/user/user.repository';
import { nowDate } from 'src/config/tools.config';
import { User } from 'src/user/entity/user.entity';
import { FeedRepository } from './feed.repository';
import { ResponseFormat, ResponseStatus } from 'src/config/config.model';
import { GetFeedDto, ReportFeedDto } from './dto/get-feed.dto';

@Injectable()
export class FeedService {
    private title = "FeedService"

    constructor(
        private readonly datasource: DataSource,
        private readonly feedRepository: FeedRepository,
        private readonly boardRepository: BoardRepository,
        private readonly siteRepository: SiteRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async createFeed(body: any, token: any, req: Request): Promise<ResponseFormat> {
        const { coin, content, price } = body;
        let queryRunner: QueryRunner;
        try{
            const site = await this.siteRepository.site();
            const user = await this.userRepository.user(body, token);
            const remainTime = Math.floor((new Date().getTime() - new Date(user.lastPostAt).getTime()) / 1000)

            if (user.lastPostAt) {
                if (remainTime < site.postingInterval){
                    return handleSend({
                        description: `게시글을 자주 작성하실 수 없습니다.<br>${site.postingInterval - remainTime}초 후 다시 시도해주세요.`, 
                        statusCode: ResponseStatus.ERROR,
                    })
                }
            }

            await this.userRepository.updateUser({
                id: token.id,
                lastPostAt: nowDate()
            } as User)

            const feed = await this.feedRepository.createFeed(body, token, req);
            if(feed == 0) {
                throw "피드 작성중 오류가 발생했습니다."
            }

            const data = {
                id: feed,
                content: content,
                price: price,
                likeCount: 0,
                createdAt: nowDate(),
                user: {
                    id: token.id,
                    nickname: token.nickname,
                    picture: token.picture,
                }
            }

            return handleSend({
                data: data,
                description: "피드를 작성했습니다.",
            })
        } catch (error) {
            if(queryRunner) await queryRunner.rollbackTransaction();
            return handleError({
                title: `[${this.title}] createFeed`, 
                error,
            });
        } finally {
            if (queryRunner) await queryRunner.release();
        }
    }

    async getFeed(query: GetFeedDto): Promise<ResponseFormat> {
        try{
            const { symbol, sort } = query;
            const getFeed = await this.feedRepository.getFeed(symbol, sort)
            
            return handleSend({
                data: getFeed
            })
        } catch (error) {
            return handleError({
                title: `[${this.title}] getFeed`, 
                error,
            })
        }
    }

    async getMyFeed(body: any, token: any): Promise<ResponseFormat> {
        try{
            const getMyFeed = await this.feedRepository.getMyFeed(body, token)
            const [ list, total ] = Object.values(getMyFeed);

            return handleSend(
                {data:{ list, total }}
            );
        } catch (error) {
            return handleError({
                title: `[${this.title}] getMyFeed`, 
                error,
            })
        }
    }

    async deleteMyFeed(body: any, token: any): Promise<ResponseFormat> {
        try{
            const deleteMyFeed = await this.feedRepository.deleteMyFeed(body, token)

            let description = "피드가 삭제됐습니다."
            let statusCode = 1

            if(deleteMyFeed != 1) {
                description = "삭제할 피드가 없습니다."
                statusCode = 0
            }

            return handleSend({
                description,
                statusCode,
            });
        } catch (error) {
            return handleError({
                title: `[${this.title}] deleteMyFeed`, 
                error,
            })
        }
    }

    async updateFeed(body: any, token: any): Promise<ResponseFormat> {
        try{
            const feedData = await this.feedRepository.getFeed(body)
            if(token.id !== feedData["user"]["id"]) {
                return handleSend({
                    description: "권한이 없습니다.", 
                    statusCode: ResponseStatus.ERROR
                })
            }
            const updateFeed = await this.feedRepository.updateFeed(body, token)

            return handleSend({
                data: updateFeed
            })
        } catch (error) {
            return handleError({
                title:`[${this.title}] updateFeed`, 
                error,
            })
        }
    }
    
    async voteLikeCount(body: any, token: any): Promise<ResponseFormat> {
        try{
            const getVote = await this.feedRepository.createVote(body, token)
            if (!getVote) {
                return handleSend({
                    description: "이미 추천했습니다.", 
                    statusCode: ResponseStatus.ERROR,
                })
            }
            return handleSend({})
        } catch (error) {
            return handleError({
                title:`[${this.title}] voteLikeCount`, 
                error,
            })
        }
    }
    
    async reportFeed(body: ReportFeedDto, token: any): Promise<ResponseFormat> {
        try{
            const getVote = await this.feedRepository.reportFeed(body, token)
            if (!getVote) {
                return handleSend({
                    description: "이미 신고했습니다.", 
                    statusCode: ResponseStatus.ERROR,
                })
            }
            return handleSend({
                description: "신고가 완료됐습니다."
            })
        } catch (error) {
            return handleError({
                title:`[${this.title}] voteLikeCount`, 
                error,
            })
        }
    }
}