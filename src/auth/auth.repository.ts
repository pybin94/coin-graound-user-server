import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';
import { nowDate } from 'src/config/tools.config';

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {};
}