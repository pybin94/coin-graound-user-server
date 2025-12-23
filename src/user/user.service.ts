import { handleError, handleSend } from 'src/config/log.tools.config';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { LogRepository } from 'src/log/log.repository';
import { ResponseStatus } from 'src/config/config.model';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async createUser(body: any, req: Request): Promise<object> {

        try {
            const duplicateCheck = await this.userRepository.duplicateCheck(body, "nickname")
            if (duplicateCheck.count > 0) {
                return handleSend({
                    description: "다른 닉네임를 사용해주세요.",
                    statusCode: ResponseStatus.ERROR,
                });
            }

            body.joinIp = req.ip
            await this.userRepository.createUser(body);

            return handleSend({ description: "가입을 완료했습니다." });
        } catch (error) {
            return handleError({
                title: "[Service] createUser",
                error,
            })
        }
    }

    async user(token: any): Promise<object> {
        try {
            const user = {
                id: token.id,
                nickname: token.nickname,
                picture: token.picture,
                email: token.email
            };

            return handleSend({
                data: user,
            });
        } catch (error) {
            return handleError({
                title: "[Service] user",
                error,
            })
        }
    }

    async updateUser(user: User, token: any): Promise<object> {
        try {

            let { picture } = user;
            const sizeInBytes = (picture.length * 3) / 4 - (picture.indexOf('=') > 0 ? picture.length - picture.indexOf('=') : 0);
            const sizeInMB = sizeInBytes / (1024 * 1024);

            if (sizeInMB > 1) {
                return handleSend({
                    description: "이미지 용량이 너무 큽니다.",
                    statusCode: ResponseStatus.ERROR,
                })
            }

            await this.userRepository.updateUser(user, token);
            return handleSend({
                description: "수정했습니다. 다시 로그인해주세요.",
            });

        } catch (error) {
            return handleError({
                title: "[Service] updateUser",
                error
            })
        }
    }

    async deleteUser(body: any): Promise<object> {
        try {
            const deleteUser = await this.userRepository.deleteUser(body)
            return handleSend({
                data: deleteUser,
                description: "플레이어를 삭제했습니다.",
            });
        } catch (error) {
            return handleError({
                title: "[Service] deleteUser",
                error,
            })
        }
    }
}