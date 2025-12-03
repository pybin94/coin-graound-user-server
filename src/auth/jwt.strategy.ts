import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from 'dotenv';
import { User } from 'src/user/entity/user.entity';
config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET_KEY,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: any) {
        const user = await this.repository.findOne(payload);
        if(!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}