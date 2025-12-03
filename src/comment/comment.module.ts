import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Comment } from './entity/comment.entity';
import { CommentReport } from './entity/comment-report.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { CommentVote } from './entity/comment-vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentVote, CommentReport]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [],
})
export class CommentModule {}