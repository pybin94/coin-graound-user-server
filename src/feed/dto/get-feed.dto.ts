import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetFeedDto {

  @IsString({message: "심볼이 잘못됐습니다."})
  symbol: number;

  @IsString({message: "정렬 방식이 잘못됐습니다."})
  @IsOptional()
  sort: string = "like";
}