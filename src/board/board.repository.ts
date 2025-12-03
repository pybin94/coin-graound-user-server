import { Injectable } from '@nestjs/common';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BoardRepository {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {};

    async board(body: any): Promise<Board> {
        const { boardName } = body
        const board = await this.boardRepository.createQueryBuilder("board")
            .select()
            .leftJoinAndSelect('board.boardMeta', "boardMeta")
            .where("board.name = :name", {name: boardName})
            .getRawOne();
            
        if(!board) {
            throw "제거 또는 이전된 페이지입니다."
        }

        return board;
    };
}