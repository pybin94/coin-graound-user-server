import { UserRepository } from 'src/user/user.repository';
import { handleError } from '../config/log.tools.config';
import { AuthRepository } from './auth.repository';
import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { Sign } from 'src/helper/sign.helper';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        private sign: Sign,
    ) {}

    async signOut(res: any) {
        try {
            await this.sign.out(res)
        } catch (error) {
            return handleError({
                title: "[Service] signOut", 
                error,
            })
        }
    }

    async setAuth(user: any, res: Response) {
        try {
            let userInfo = await this.userRepository.getUserInfo(user);
            if(!userInfo) {
                if(!user.nickname) {
                    user.nickname = user.email.split('@')[0];
                }
                userInfo = await this.userRepository.createUser(user);
            }

            const payload = {
                id: userInfo.id,
                nickname: userInfo.nickname,
                picture: userInfo.picture,
                email: userInfo.email,
            }

            const accessToken = this.jwtService.sign(payload);
            await this.sign.in(res, accessToken);

            const redirectUrl = `http://${process.env.CLIENT_DOMAIN}`;
        // const redirectUrl = `https://${process.env.CLIENT_DOMAIN}`;
            return res.redirect(redirectUrl);
        } catch (error) {
            return handleError({
                title: "[Service] setAuth", 
                error,
            })
        }
    }
}