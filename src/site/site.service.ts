import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';
import { BoardRepository } from 'src/board/board.repository';
import { SiteRepository } from './site.repository';

@Injectable()
export class SiteService {
    private title = "SiteService"

    constructor(
        private readonly siteRepository: SiteRepository,
    ) {}

    async site(body: any): Promise<object> {
        try{
            return handleSend({})
        } catch (error) {
            return handleError({
                title:`[${this.title}] site`, 
                error
            })
        }
    }
}