import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UserSignInDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    @ApiProperty()
    identity: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(15)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number'
    })
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @ApiProperty()
    nickname: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @ApiProperty()
    set1: string;

    @IsString()
    @MaxLength(20)
    @ApiProperty()
    set2: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    @ApiProperty()
    set3: string = "데이터 없음";

    @IsString()
    @MaxLength(50)
    @ApiProperty()
    memo: string;

}