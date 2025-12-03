import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { IPBlockMiddleware } from './middleware/IP-block.middleware';
import { SiteModule } from './site/site.module';
import { BoardModule } from './board/board.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LogModule } from './log/log.module';
import { PopupModule } from './popup/popup.module';
import { CoinModule } from './coin/coin.module';
import { FeedModule } from './feed/feed.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    SiteModule,
    UserModule,
    AuthModule,
    BoardModule,
    PostModule,
    CommentModule,
    LogModule,
    PopupModule,
    CoinModule,
    FeedModule,
    NewsModule,
  ],
  providers: [IPBlockMiddleware],
})

export class AppModule implements NestModule {
  constructor(private readonly ipBlockMiddleware: IPBlockMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.ipBlockMiddleware.use.bind(this.ipBlockMiddleware)).forRoutes('*');
  }
}