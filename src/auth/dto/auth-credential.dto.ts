import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength, IsNotEmpty, IsNumber } from "class-validator";

export class AuthCredentialsDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty()
    identity: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number'
    })
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    captcha: boolean;

    @IsString()
    @IsNotEmpty()
    ip: string;
}