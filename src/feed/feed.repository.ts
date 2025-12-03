import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, QueryRunner, Repository } from 'typeorm';
import { Feed } from './entity/feed.entity';
import { BoardType, VoteType } from './feed.model';
import { FeedVote } from './entity/feed-vote.entity';
import { GetFeedDto } from './dto/get-feed.dto';

@Injectable()
export class FeedRepository {
    constructor(
        @InjectRepository(Feed)
        private readonly feedRepository: Repository<Feed>,

        @InjectRepository(FeedVote)
        private readonly feedVoteRepository: Repository<FeedVote>,

    ) {};

    async createFeed(body: any, token: any, req: Request): Promise<number> {
        const { coin, content, price } = body;
        const createdIp = req.headers['x-real-ip'] ?  req.headers['x-real-ip'] : "0:0:0:0"
        
        const createFeedData = {
            coin,
            content,
            price,
            user: token.id,
            createdIp
        }

        const createFeed = await this.feedRepository.createQueryBuilder()
            .insert()
            .values(createFeedData)
            .into(Feed)
            .execute();

        return createFeed.raw.insertId
    };

    async getFeed(coinId: number, sort: string = "like"): Promise<Feed[]> {

        let getFeedQueryBuilder = this.feedRepository.createQueryBuilder("feed")
            .select([
                "feed.id",
                "feed.content",
                "feed.createdAt",
                "feed.updatedAt",
                "feed.likeCount",
                "feed.price",
                "user.id",
                "user.nickname",
                "user.picture",
            ])
            .leftJoin('feed.user', "user")
            .leftJoin('feed.coin', "coin")
            .where("coin.id = :id", {id: coinId})
            .andWhere("feed.blockedAt IS NULL")

            if (sort == "like") {
                getFeedQueryBuilder.orderBy("feed.likeCount", "DESC")
            } else {
                getFeedQueryBuilder.orderBy("feed.id", "DESC")
            }

            const getFeed = await getFeedQueryBuilder.getMany();

        return getFeed;
    };

    async updateFeed(body: any, token: any): Promise<void> {
        const { feedId, title, content, thumbnailURL, meta } = body;

        await this.feedRepository.createQueryBuilder("feed")
            .update()
            .set({content})
            .where("id = :id", {id: feedId})
            .execute();
    };

    async voteLikeCount(body: any,): Promise<void> {
        const { feedId, voteTpye } = body;

        const feedQueryBuilder = this.feedRepository.createQueryBuilder("feed")
            .update()
            .where("id = :id", {id: feedId})

            if (voteTpye == VoteType.LIKE) {
                feedQueryBuilder.set({likeCount: () => "like_count + 1"})
            } else if (voteTpye == VoteType.DISLIKE) {
                feedQueryBuilder.set({dislikeCount: () => "dislike_count + 1"})
            }

            await feedQueryBuilder.execute();
    };

    async getVote(body: any, token: any): Promise<object> {
        const { feedId, voteTpye } = body;

        const getVote =  await this.feedVoteRepository.createQueryBuilder("feedVote")
            .select()
            .where("feedVote.user = :userId", {userId: token.id})
            .andWhere("feedVote.feed = :feedId", {feedId})
            .getOne()

        return getVote;
    };

    async createVote(body: any, token: any): Promise<void> {
        const { feedId, voteTpye } = body;

        const values = {
            user: token.id,
            feed: feedId,
            type: voteTpye,
        }

        await this.feedVoteRepository.createQueryBuilder()
            .insert()
            .values(values)
            .into(FeedVote)
            .execute();
    };
}