import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { User } from './entity/user.entity';
import { UserSerachType } from './user.model';
import { base64ToFileAndSave } from 'src/config/file.tools.config';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    };

    async duplicateCheck(body: any, checkColumn: string): Promise<{ count: number }> {
        let injectionType: string;
        let setWhere: object;

        if(checkColumn == "nickname" && body[checkColumn]) {
            injectionType = "user.nickname = :nickname";
            setWhere = {nickname: body[checkColumn]};
        } else if (checkColumn == "phone" && body[checkColumn]){
            injectionType = "user.phone = :phone";
            setWhere = {phone: body[checkColumn]}
        } else {
            throw "잘못된 접근입니다."
        }
        
        const duplicateCheck = await this.userRepository.createQueryBuilder("user")
            .select('COUNT(*)', 'count')
            .andWhere(`${injectionType}`, setWhere)
            .getRawOne();

        return duplicateCheck;
    }           

    async getUserInfo(user: User): Promise<User> {
        const userInfo = await this.userRepository.createQueryBuilder()
            .select()
            .where("user.provider = :provider", {provider: user.provider})
            .andWhere("user.provider_user_id = :providerUserId", {providerUserId: user.providerUserId})
            .getOne();

        return userInfo
    }

    async createUser(user: User): Promise<User> {
        const result = await this.userRepository.createQueryBuilder()
            .insert()
            .values(user)
            .into(User)
            .execute();
        
        const id = result.identifiers[0].id;
        return await this.userRepository.findOneBy({ id });
    }

    async user(body: any, token: any): Promise<User> {

        let { id, searchType, target } = body;
        let user: User;

        let column = [
            "user.id",
            "user.nickname",
            "user.picture",
        ]

        const queryBuilder = this.userRepository.createQueryBuilder("user")

        if (id) {
            queryBuilder.andWhere("user.id = :id", {id})
        } else if(UserSerachType.IDENTITY == searchType) {
            queryBuilder.andWhere("user.identity = :identity", { identity: target})
        } else if (UserSerachType.NICKNAME == searchType){
            queryBuilder.andWhere("user.nickname = :nickname", { nickname: target})
        } else {
            column = [
                ...column,
                "user.lastPostAt"
            ]

            queryBuilder.andWhere("user.id = :id", { id: token.id})
        }

        queryBuilder.select(column);
        
        user = await queryBuilder.getOne();
        return user;
    }

    async updateUser(user: User, token?: any): Promise<void> {
        let { id, picture, nickname, lastPostAt } = user;

        let updateData = {} as User

        if (picture) {
            const filePath = `/src/assets/uploads/profile/${token.id}.jpg`
            const clientFilePath = `../../../user-client${filePath}`

            updateData["picture"] = filePath;
            base64ToFileAndSave(picture, clientFilePath);
        };
        if (nickname) updateData["nickname"] = nickname;
        if (lastPostAt) updateData["lastPostAt"] = lastPostAt;

        if(Object.keys(updateData).length !== 0) {
            await this.userRepository.createQueryBuilder("user")
                .update()
                .where("id = :id", { id: (token ? token.id : id) })
                .set(updateData)
                .execute();
        }
    }

    async deleteUser(body: any): Promise<object> {
        let { id } = body;
        const deleteUser = await this.userRepository.createQueryBuilder("user")
            .where("id = :id", { id })
            .execute()

        return deleteUser;
    }
}