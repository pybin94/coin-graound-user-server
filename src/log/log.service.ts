import { handleError, handleSend } from 'src/config/log.tools.config';
import { Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
    private title = "LogService"

    constructor(
        private readonly logRepository: LogRepository,
    ) {}

    async oceanSignal(token: any): Promise<object> {
        const oceanSignal = await this.logRepository.oceanSignal(token);
        return oceanSignal;
    }

}