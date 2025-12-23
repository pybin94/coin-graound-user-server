import { Token } from 'src/user/user.decorator';
import { JwtAuthGuard } from '../gaurds/jwt-auth.gaurd';
import { Controller, UseGuards, Body, Get } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
@UseGuards(JwtAuthGuard)
export class BoardController {
    constructor(
        private readonly BoardService: BoardService
    ) { }
}