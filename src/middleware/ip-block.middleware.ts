import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { handleError } from 'src/config/log.tools.config';

@Injectable()
export class IPBlockMiddleware implements NestMiddleware {
    constructor(
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {

        try {
            const clientIP = req.ip;
            let list = []
            let IPs: string[] = [];

            list.forEach((item: Array<string>) => {
                IPs = [...IPs, item["ip"]]
            });

            if (IPs.includes(clientIP)) {
                next();
            }
            return next();
            // return handleError("[Middleware] IPBlockMiddleware", [], `아이피가 차단돼있습니다. 관리자에게 문의주세요. \n 차단된 아이피[${clientIP}]`, -1);
        } catch (error) {
            handleError({
                title: "[Middleware] IPBlockMiddleware", 
                error,
            });
        }
    }
}

