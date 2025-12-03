import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Site } from './entity/site.entity';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { SiteRepository } from './site.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Site]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [SiteController],
  providers: [SiteService, SiteRepository],
  exports: [SiteRepository],
})

export class SiteModule {}