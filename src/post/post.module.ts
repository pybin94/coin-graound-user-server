import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entity/post.entity';
import { PostVote } from './entity/post-vote.entity';
import { PostReport } from './entity/post-report.entity';
import { BoardModule } from 'src/board/board.module';
import { SiteModule } from 'src/site/site.module';
import { UserModule } from 'src/user/user.module';
import { PostMeta } from './entity/post-meta.entity';
import { PostRepository } from './post.repository';

@Module({
  imports: [
    SiteModule,
    BoardModule,
    UserModule,
    TypeOrmModule.forFeature([Post, PostVote, PostReport, PostMeta]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [],
})
export class PostModule {}