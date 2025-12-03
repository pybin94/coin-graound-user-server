import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService {
    private title = "BoardService"

    constructor(
    ) {}

    async board(body: any): Promise<object> {
        try{
            return handleSend({})
        } catch (error) {
            return handleError({
                title: `[${this.title}] board`, 
                error,
            })
        }
    }
}