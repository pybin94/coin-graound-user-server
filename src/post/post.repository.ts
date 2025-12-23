import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, QueryRunner, Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { BoardType, VoteType } from './post.model';
import { PostVote } from './entity/post-vote.entity';
import { base64ToFileAndSave, removeFile } from 'src/config/file.tools.config';
import { PostMeta } from './entity/post-meta.entity';
import { handleError } from 'src/config/log.tools.config';

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(PostVote)
        private readonly postVoteRepository: Repository<PostVote>,

        @InjectRepository(PostMeta)
        private readonly postMetaRepository: Repository<PostMeta>,
    ) { };

    async createPost(queryRunner: QueryRunner, body: any, token: any, req: Request): Promise<number> {
        const { title, content, boardId, thumbnailURL, meta } = body;
        const createdIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : "0:0:0:0"

        const createPostData = {
            title,
            content,
            board: boardId,
            thumbnailURL,
            user: token.id,
            createdIp
        }
        const user = this.postRepository.create(createPostData);
        console.log(user)
        const post = await queryRunner.manager.save(user);

        if (meta) {
            meta.forEach(async (item: string, index: number) => {
                const postMetaData = {
                    board: boardId,
                    post: post,
                    type: "DESC",
                    priority: index,
                }

                postMetaData["value"] = item["description"]

                const postMeta = this.postMetaRepository.create(postMetaData);
                await queryRunner.manager.save(postMeta);
            })
        };
        return 0
    };

    async postList(body: any): Promise<object> {
        const { limit, offset, searchValue, boardId } = body;

        const postListQueryBuilder = this.postRepository.createQueryBuilder("post")
            .select([
                "post.id",
                "post.title",
                "post.createdAt",
                "post.updatedAt",
                "post.viewCount",
                "post.likeCount",
                "post.dislikeCount",
            ])
            .leftJoin('post.user', "user")
            .addSelect([
                "user.id",
                "user.nickname",
                "user.picture"
            ])
            .leftJoin('post.comment', "comment")
            .addSelect([
                "comment.id",
            ])
            .where("post.board = :boardId", { boardId })
            .andWhere("comment.blockedAt IS NULL")
            .orderBy("post.id", "DESC")
            .take(limit)
            .skip(offset)

        const totalQueryBuilder = this.postRepository.createQueryBuilder("post")
            .where("post.board = :boardId", { boardId })
            .limit(limit)
            .offset(offset)

        if (searchValue) {
            postListQueryBuilder.andWhere(new Brackets(qb => {
                qb.where("post.title LIKE :searchValue")
                    .orWhere("user.nickname LIKE :searchValue")
            }), { searchValue: `%${searchValue}%` });

            totalQueryBuilder.leftJoin('post.user', "user")
            totalQueryBuilder.andWhere(new Brackets(qb => {
                qb.where("post.title LIKE :searchValue")
                    .orWhere("user.nickname LIKE :searchValue")
            }), { searchValue: `%${searchValue}%` });
        }

        const postList = await postListQueryBuilder.getMany();
        const postTotal = await totalQueryBuilder.getCount();
        const list = postList;
        const total = postTotal;

        return { list, total };
    };

    async getPost(body: any): Promise<Post> {
        const { postId } = body;
        const getPost = await this.postRepository.createQueryBuilder("post")
            .select([
                "post.id",
                "post.title",
                "post.content",
                "post.createdAt",
                "post.updatedAt",
                "post.viewCount",
                "post.likeCount",
                "post.dislikeCount",
                "user.nickname",
                "user.id",
                "user.picture",
                "postMeta.id",
                "postMeta.value",
                "postMeta.priority",
                "postMeta.type",
            ])
            .leftJoin('post.user', "user")
            .leftJoin('post.postMeta', "postMeta")
            .where("post.id = :id", { id: postId })
            .getOne();

        return getPost;
    };

    async updatePost(body: any, token: any): Promise<void> {
        const { postId, title, content, thumbnailURL, meta } = body;

        await this.postRepository.createQueryBuilder("post")
            .update()
            .set({ title, content, thumbnailURL })
            .where("id = :id", { id: postId })
            .execute();

        if (meta) {
            meta.forEach(async (item: string, index: number) => {

                const postMetaData = {}
                if (item["image"]) {
                    const filePath = `/src/assets/uploads/banner/${(new Date().getTime())}.jpg`
                    const clientFilePath = `../../../user-client`
                    base64ToFileAndSave(item["image"], clientFilePath + filePath);
                    if (item["beforeFilePath"]) {
                        removeFile(clientFilePath + item["beforeFilePath"])
                    }
                    postMetaData["value"] = filePath
                } else if (item["description"]) {
                    postMetaData["value"] = item["description"]
                }

                if (Object.keys(postMetaData).length !== 0) {
                    await this.postMetaRepository.createQueryBuilder("postMeta")
                        .update()
                        .set(postMetaData)
                        .where("id = :id", { id: item["id"] })
                        .execute();
                }
            })
        };
    };

    async updateViewCount(body: any): Promise<void> {
        const { postId } = body;

        await this.postRepository.createQueryBuilder("post")
            .update()
            .set({ viewCount: () => "view_count + 1" })
            .where("id = :id", { id: postId })
            .execute();
    };

    async voteLikeCount(body: any,): Promise<void> {
        const { postId, voteTpye } = body;

        const postQueryBuilder = this.postRepository.createQueryBuilder("post")
            .update()
            .where("id = :id", { id: postId })

        if (voteTpye == VoteType.LIKE) {
            postQueryBuilder.set({ likeCount: () => "like_count + 1" })
        } else if (voteTpye == VoteType.DISLIKE) {
            postQueryBuilder.set({ dislikeCount: () => "dislike_count + 1" })
        }

        await postQueryBuilder.execute();
    };

    async getVote(body: any, token: any): Promise<object> {
        const { postId, voteTpye } = body;

        const getVote = await this.postVoteRepository.createQueryBuilder("postVote")
            .select()
            .where("postVote.user = :userId", { userId: token.id })
            .andWhere("postVote.post = :postId", { postId })
            .getOne()

        return getVote;
    };

    async createVote(body: any, token: any): Promise<void> {
        const { postId, voteTpye } = body;

        const values = {
            user: token.id,
            post: postId,
            type: voteTpye,
        }

        await this.postVoteRepository.createQueryBuilder()
            .insert()
            .values(values)
            .into(PostVote)
            .execute();
    };

    async uploadImage(body: any): Promise<object> {
        const { image } = body;
        const imageName = (new Date().getTime())
        const filePath = `/src/assets/uploads/post/${imageName}.webp`
        const clientFilePath = `../../../user-client${filePath}`

        base64ToFileAndSave(image, clientFilePath);

        return { filePath }
    };

}