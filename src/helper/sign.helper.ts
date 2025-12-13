import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class Sign {
  
    async in (res: any, accessToken: string, payload: User) {
        await res.cookie("token", accessToken, {
            // httpOnly: true,
            // sameSite: "none",
            // secure: true,
            domain: process.env.CLIENT_DOMAIN && "localhost",
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: '/',
        })
        await res.cookie("userInfo", JSON.stringify(payload), {
            // sameSite: "none",
            // secure: true,
            domain: process.env.CLIENT_DOMAIN && "localhost",
            sameSite: "lax",
            secure: false,
            path: '/',
        })

        return;
    }
    
    async out (res: any) {
        await res.cookie("token", null, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            domain: process.env.CLIENT_DOMAIN && "localhost",
            path: '/',
            maxAge: 0
        });

        await res.cookie("userInfo", null, {
            sameSite: "none",
            secure: true,
            domain: process.env.CLIENT_DOMAIN && "localhost",
            path: '/',
            maxAge: 0
        });

        return;
    }
}