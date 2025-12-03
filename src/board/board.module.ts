import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Board } from './entity/board.entity';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';
import { BoardMeta } from './entity/baord-meta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardMeta]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository],
  exports: [BoardRepository],
})
export class BoardModule {}