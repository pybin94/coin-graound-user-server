import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        super({
            clientID: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_DOMAIN}/kakao/redirect`,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const user = {
            kakaoId: profile.id,
            nickname: profile.username,
            email: profile._json?.kakao_account?.email,
            accessToken,
        };
        done(null, user);
    }
}

@Injectable()
export class KakaoAuthGuard extends AuthGuard("kakao") {
    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const state = req.query.state || null;

        return {
            state,
        };
    }
}