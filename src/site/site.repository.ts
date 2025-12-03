import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './entity/site.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SiteRepository {
    constructor(
        @InjectRepository(Site)
        private readonly siteRepository: Repository<Site>,
    ) {};

    async site(): Promise<any> {
        const site = await this.siteRepository
            .createQueryBuilder("site")
            .getOne()
            
        return site;
    }
}