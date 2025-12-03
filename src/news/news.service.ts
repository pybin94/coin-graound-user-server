import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
    private title = "NewsService"

    constructor(
        private readonly newsRepository: NewsRepository,
    ) {}

    async newsList(body: any): Promise<object> {
        try{
            const newsList = await this.newsRepository.newsList(body)
            const [list, total] = Object.values(newsList)

            return handleSend({
                data: { list, total },
            })
        } catch (error) {
            return handleError({
                title: `[${this.title}] newsList`, 
                error,
            })
        }
    }
}