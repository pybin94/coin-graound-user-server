import { JwtStrategy } from './jwt.strategy';
import { AuthRepository } from './auth.repository';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Sign } from 'src/helper/sign.helper';
import { User } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { NaverStrategy } from './strategy/naver.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt', session: false}),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions:{
                expiresIn: parseInt(process.env.JWT_EXPIRES),
            }
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [
            AuthService, 
            AuthRepository, 
            JwtStrategy, 
            Sign, 
            GoogleStrategy,
            NaverStrategy,
            KakaoStrategy,
        ],
})
export class AuthModule {}