import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { User } from './entity/user.entity';

export const Token = createParamDecorator( async (isNecessary = true, ctx: ExecutionContext): Promise<User | object> => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.token;
    if (isNecessary && !token) throw new UnauthorizedException('Unauthorized', '-2'); 
    return token;
})