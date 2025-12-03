import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Popup } from './entity/popup.entity';

@Injectable()
export class PopupRepository {
    constructor(
        @InjectRepository(Popup)
        private readonly popupRepository: Repository<Popup>,
    ) {};
}