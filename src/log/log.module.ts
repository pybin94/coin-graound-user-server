import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LogJoin } from './entity/log-join.entity';
import { LogRepository } from './log.repository';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { LogBtcWhale } from './entity/log-btc-whale.entity';
import { LogWhaleLiquidation } from './entity/log_whale_liquidations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        LogJoin, 
        LogBtcWhale, 
        LogWhaleLiquidation
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [LogController],
  providers: [LogService, LogRepository],
  exports: [LogRepository],
})
export class LogModule {}