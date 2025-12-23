import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogJoin } from './entity/log-join.entity';
import { LogBtcWhale } from './entity/log-btc-whale.entity';
import { LogWhaleLiquidation } from './entity/log_whale_liquidations.entity';

@Injectable()
export class LogRepository {
    constructor(
        @InjectRepository(LogJoin)
        private readonly logJoinRepository: Repository<LogJoin>,
        @InjectRepository(LogBtcWhale)
        private readonly logBtcWhaleRepository: Repository<LogBtcWhale>,
        @InjectRepository(LogWhaleLiquidation)
        private readonly logWhaleLiquidationRepository: Repository<LogWhaleLiquidation>,
    ) { };

    async oceanSignal(token: any): Promise<LogBtcWhale> {
        // const oceanSignal = await this.logJoinRepository.find({
        //     where: {
        //         user_id: token.id,
        //     },
        // });

        return;
    }
}