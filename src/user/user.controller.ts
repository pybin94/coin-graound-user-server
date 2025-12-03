import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { UserService } from './user.service';
import { Controller, UseGuards, Post, Body, Patch, Delete, Get } from '@nestjs/common';
import { Token } from 'src/user/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor( 
        private readonly userService: UserService 
    ) {}

    @Get('/')
    async user(@Token() token: any): Promise<object> {
        const user = await this.userService.user(token);
        return user;
    }

    @Patch('/update')
    async updateUser(@Body() body: any, @Token() token: any): Promise<object> {
        const updateResult = await this.userService.updateUser(body, token);
        return updateResult;
    }

    @Delete('/delete')
    async deleteUser(@Body() body: any): Promise<object> {
        const deleteResult = await this.userService.deleteUser(body);
        return deleteResult;
    }
}