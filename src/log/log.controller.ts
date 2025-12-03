import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Post, Req, Patch, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
    constructor( 
        private readonly logService: LogService
    ) {}

    @Get('/ocean-signal')
    async oceanSignal(@Token() token: any): Promise<object> {
        const oceanSignal = await this.logService.oceanSignal(token);
        return oceanSignal;
    }
}