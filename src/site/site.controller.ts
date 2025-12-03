import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Get } from '@nestjs/common';
import { SiteService } from './site.service';

@Controller('site')
@UseGuards(JwtAuthGuard)
export class SiteController {
    constructor( 
        private readonly siteService: SiteService 
    ) {}

    @Get('/')
    async Site(@Body() body: any, @Token() token: any): Promise<object> {
        return;
    }

}