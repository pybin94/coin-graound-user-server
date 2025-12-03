import { handleError} from '../config/log.tools.config';
import { Controller, Get, UseGuards, Res, HttpStatus, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { GoogleModel, KakaoModel, NaverModel } from './auth.model';
import got from 'got';

@Controller()
export class AuthController {

    private title = "Auth"

    constructor( 
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Get('/joinout')
    @HttpCode(HttpStatus.OK)
    async signOut(@Res({ passthrough: true }) res: any) {
        try {
            await this.authService.signOut(res);
            return {ststue: 1, message: "Logout successful"}
        } catch (error) {
            return handleError({title: `[${this.title}] signout`, error})
        }
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const user = req.user as GoogleModel;

        let response = await got('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
            },
        }).json() as Array<object>;
        
        const authInfo = { 
            provider: "google", 
            providerUserId: response["sub"], 
            email: user.email, 
            nickname: user.name, 
            picture: user.picture
        };

        return await this.authService.setAuth(authInfo, res);
    }

    @Get('/naver')
    @UseGuards(AuthGuard('naver'))
    async naverLogin() {}
  
    @Get('/naver/redirect')
    @UseGuards(AuthGuard('naver'))
    async naverAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const user = req.user as NaverModel;
        const authInfo = { 
            provider: user.provider, 
            providerUserId: user.snsId, 
            email: user.email.value, 
            nickname: user.nickname, 
            picture: user.profileImage
        };

        return await this.authService.setAuth(authInfo, res);
    }

    @Get('kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLogin() {}
  
    @Get('kakao/redirect')
    @UseGuards(AuthGuard('kakao'))
    async kakaoCallback(@Req() req: Request, @Res() res: Response) {
        const user = req.user as KakaoModel;

        let response = await got('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
            },
        }).json() as Array<object>;

        const authInfo = { 
            provider: "kakao",
            providerUserId: user.kakaoId, 
            email: user.email,
            picture: response["properties"]["profile_image"],
            nickname: user.nickname,
            kakaoId: user.kakaoId
        };

        return await this.authService.setAuth(authInfo, res);
    }
}