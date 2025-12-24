import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_DOMAIN}/google/redirect`,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
    }

    async validate(req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            name: name.givenName,
            picture: photos[0].value,
            accessToken,
        };
        done(null, user);
    }
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    constructor(private reflector: Reflector) {
        super();
    }

    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const state = req.query.state || null;

        return {
            state,
        };
    }
}