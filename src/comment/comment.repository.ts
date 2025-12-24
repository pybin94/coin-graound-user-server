import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CommentVote } from './entity/comment-vote.entity';
import { CommentReport } from './entity/comment-report.entity';
import { nowDate } from 'src/config/tools.config';

@Injectable()
export class CommentRepository {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(CommentVote)
        private readonly commentVoteRepository: Repository<CommentVote>,

        @InjectRepository(Comment)
        private readonly commentReportRepository: Repository<CommentReport>,
    ) { };

    async getComment(body: any): Promise<any> {
        const { commentId } = body;
        const getComment = await this.commentRepository.createQueryBuilder("comment")
            .select([
                "comment.parent",
                "user.id",
            ])
            .leftJoin('comment.user', "user")
            .where("comment.id = :id", { id: commentId })
            .getRawOne();

        return getComment;
    }

    async getComments(body: any): Promise<any> {
        const { postId } = body;

        const treeRepository = this.commentRepository;
        const rootNode = await treeRepository.createQueryBuilder("comment")
            .select([
                "comment.id",
                "comment.content",
                "comment.createdAt",
                "comment.blockedAt",
                "user.id",
                "user.nickname",
                "user.picture",
            ])
            .leftJoin('comment.user', "user")
            .where("comment.post = :postId", { postId })
            .andWhere("comment.parent IS NULL")
            .orderBy("comment.id", "ASC")
            .getMany();

        const getComments = await Promise.all(rootNode.map((node: any) => this.createTreeStructure(node, treeRepository)));
        return getComments;
    }

    async createTreeStructure(node: any, repository: any): Promise<Comment> {
        const children = await repository.createQueryBuilder("comment")
            .select([
                "comment.id",
                "comment.content",
                "comment.createdAt",
                "comment.blockedAt",
                "user.id",
                "user.nickname",
                "user.picture",
            ])
            .leftJoin('comment.user', "user")
            .where("comment.parent = :parentId", { parentId: node.id })
            .orderBy("comment.id", "ASC")
            .getMany();

        if (children.length === 0) {
            return node;
        };

        const childNodes = await Promise.all(children.map((child: any) => this.createTreeStructure(child, repository)));
        node.children = childNodes;

        return node;
    };

    async createComment(body: any, token: any, req: Request, queryRunner: QueryRunner): Promise<void> {
        const { content, postId, parentId, replyComment } = body;
        const createdIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : "0:0:0:0"

        const createPostData = {
            post: postId,
            user: token.id,
            createdIp,
        }

        if (!parentId) {
            createPostData["content"] = content;
        } else {
            createPostData["content"] = replyComment;
            createPostData["parent"] = parentId;
        }

        const user = this.commentRepository.create(createPostData);
        await queryRunner.manager.save(user);
    };

    async deleteComment(body: any, token: any): Promise<void> {
        const { commentId, parentId } = body;
        if (parentId) {
            await this.commentRepository.createQueryBuilder()
                .delete()
                .where("id = :id", { id: commentId })
                .execute();
        } else {
            await this.commentRepository.createQueryBuilder()
                .update()
                .set({ blockedAt: nowDate() })
                .where("id = :id", { id: commentId })
                .execute();
        }
        return;
    };
}