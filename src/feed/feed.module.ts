import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Feed } from './entity/feed.entity';
import { FeedVote } from './entity/feed-vote.entity';
import { FeedReport } from './entity/feed-report.entity';
import { BoardModule } from 'src/board/board.module';
import { SiteModule } from 'src/site/site.module';
import { UserModule } from 'src/user/user.module';
import { FeedRepository } from './feed.repository';

@Module({
  imports: [
    SiteModule,
    BoardModule,
    UserModule,
    TypeOrmModule.forFeature([Feed, FeedVote, FeedReport]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [FeedController],
  providers: [FeedService, FeedRepository],
  exports: [],
})
export class FeedModule {}