import { Injectable } from '@nestjs/common';
import { News } from './entity/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NewsRepository {
    constructor(
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
    ) {};

    async newsList(body: any): Promise<[News[], number]> {
        const { limit, offset} = body;

        const newsList = await this.newsRepository.createQueryBuilder("news")
            .select()
            .orderBy("news.id", "DESC")
            .take(limit)
            .skip(offset)
            .getManyAndCount()

        return newsList;
    };
}