import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';
import { PopupRepository } from './popup.repository';

@Injectable()
export class PopupService {
    private title = "PopupService"

    constructor(
        private readonly popupRepository: PopupRepository,
    ) {}

    async popup(body: any): Promise<object> {
        try{
            return handleSend({})
        } catch (error) {
            return handleError({
                title: `[${this.title}] popup`, 
                error,
            })
        }
    }
}