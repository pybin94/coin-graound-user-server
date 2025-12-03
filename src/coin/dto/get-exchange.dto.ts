import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetExchangeDto {
  @IsNumber({}, { message: '거래소 정보가 잘못됐습니다.' })
  @Transform(({ value }) => Number(value))
  exchange: number;
}