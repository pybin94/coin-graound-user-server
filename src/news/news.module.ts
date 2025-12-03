import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { News } from './entity/news.entity';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsRepository } from './news.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository],
  exports: [NewsRepository],
})
export class NewsModule {}