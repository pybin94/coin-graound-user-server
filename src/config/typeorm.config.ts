import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import {config} from 'dotenv';
import { createConnection } from "typeorm";
config()

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: false,
    // logging: (process.env.NODE_ENV === 'development' ? ['query', 'schema'] : false),
    charset: 'utf8mb4',
    keepConnectionAlive: true,
    poolSize: 20,
    timezone: "+09:00",
}

const connection = createConnection({
    name: "default",
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});