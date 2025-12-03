import { JwtModule } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserFollow } from './entity/user-follow.entity';
import { UserNotice } from './entity/user-notice.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    LogModule,
    TypeOrmModule.forFeature([User, UserFollow, UserNotice]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRES),
      }
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}