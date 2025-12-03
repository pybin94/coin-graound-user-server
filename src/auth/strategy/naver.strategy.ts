import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor() {
        super({
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_DOMAIN}/naver/redirect`,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const { id, emails, nickname, profileImage } = profile;

        return {
            provider: 'naver',
            snsId: id,
            email: emails?.[0],
            nickname,
            profileImage,
        };
    }
}
