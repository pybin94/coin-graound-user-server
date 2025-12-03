import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserNotice } from "./user-notice.entity";
import { UserFollow } from "./user-follow.entity";
import { CommentVote } from "src/comment/entity/comment-vote.entity";
import { CommentReport } from "src/comment/entity/comment-report.entity";
import { LogJoin } from "src/log/entity/log-join.entity";
import { Post } from "src/post/entity/post.entity";

@Entity({ name: "user" })
@Unique(['provider', 'providerUserId'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 50, comment: "google, apple, naver, kakao"})
    provider: string;
    
    @Column({ name: "provider_user_id", length: 255 })
    providerUserId: string;

    @Column({ length: 20 })
    nickname: string;

    @Column({ name: "email", length: 100, nullable: true })
    email: string;

    @Column({ length: 20, nullable: true })
    name: string;

    @Column({ width: 11, nullable: true })
    phone: string;

    @Column({ type: "smallint", default: 0, comment: "0: 유저 1: 관리자"})
    role: number;

    @Column({ nullable: true, comment: "프로필 사진 경로"})
    picture: string;

    @Column({nullable: true})
    memo: string;

    @Column({ name: "max_consecutive_count", type: "integer", default: 1, comment: "최대 연속 출석일"})
    maxConsecutiveCount: number;

    @Column({ name: "current_consecutive_count", type: "integer", default: 1, comment: "현재 연속 출석일"})
    currentConsecutiveCount: number;

    @Column({ name: "total_count", type: "integer", default: 1, comment: "전체 출석일"})
    totalCount: number;

    @Column({ name: "last_post_at", nullable: true, comment: "마지막 포스팅 시간" })
    lastPostAt: string;

    @Column({ name: "ban_end_date", nullable: true, comment: "정지 기간" })
    banEndDate: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @Column({ name: "latest_at", nullable: true, comment: "마지막 접속일" })
    latestAt: string;
    
    @Column({ name: "blocked_at", nullable: true })
    blockedAt: string;

    @OneToMany(type => UserNotice, userNotice => userNotice.user, { cascade: true })
    userNotice: UserNotice[];

    @OneToMany(type => UserFollow, userFollow => userFollow.followingUser, { cascade: true })
    followingUser: UserFollow[];

    @OneToMany(type => UserFollow, userFollow => userFollow.followedUser, { cascade: true })
    followedUser: UserFollow[];

    @OneToMany(type => CommentVote, commentVote => commentVote.user, { cascade: true })
    commentVote: CommentVote[];

    @OneToMany(type => CommentReport, commentReport => commentReport.user, { cascade: true })
    commentReport: CommentReport[];

    @OneToMany(type => LogJoin, logJoin => logJoin.user, { cascade: true })
    logJoin: LogJoin[];

    @OneToMany(type => Post, post => post.user, { cascade: true })
    post: Post[];
}