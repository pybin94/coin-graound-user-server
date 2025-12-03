import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Get } from '@nestjs/common';
import { PopupService } from './popup.service';

@Controller('popup')
@UseGuards(JwtAuthGuard)
export class PopupController {
    constructor( 
        private readonly popupService: PopupService 
    ) {}

    @Get('/')
    async createUser(@Body() body: any, @Token() token: any): Promise<object> {
        return;
    }
}