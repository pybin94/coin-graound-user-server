import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Popup } from './entity/popup.entity';
import { PopupController } from './popup.controller';
import { PopupService } from './popup.service';
import { PopupRepository } from './popup.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Popup]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [PopupController],
  providers: [PopupService, PopupRepository],
  exports: [],
})
export class PopupModule {}