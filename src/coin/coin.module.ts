import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Coin } from './entity/coin.entity';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import { CoinRepository } from './coin.repository';
import { CoinExchange } from './entity/coin-exchange.entity';
import { Exchange } from './entity/exchange.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coin, CoinExchange, Exchange]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [CoinController],
  providers: [CoinService, CoinRepository],
  exports: [CoinRepository],
})
export class CoinModule {}