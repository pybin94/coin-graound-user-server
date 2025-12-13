import { IsNumber, IsOptional, IsString, IsIn, IsNotEmpty, Min, Equals } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportTypeEnum } from '../feed.model';

export class GetFeedDto {

  @IsString({message: "심볼이 잘못됐습니다."})
  symbol: number;

  @IsString({message: "정렬 방식이 잘못됐습니다."})
  @IsOptional()
  sort: string = "like";
}

export class GetMyFeedDto {
    @Type(() => Number)
    @IsNumber()
    @Equals(10, {message: "limit은 10만 허용됩니다."})
    limit: number;
  
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset: number;
}

export class ReportFeedDto {
    @IsNotEmpty({ message: '피드 ID는 필수입니다.' })
    @IsNumber({}, { message: '피드 ID는 숫자 형식이어야 합니다.' })
    @Type(() => Number) // 입력이 문자열이더라도 숫자로 변환 시도
    feedId: number;

    @IsNotEmpty({ message: '신고 유형은 필수입니다.' })
    @IsNumber({}, { message: '신고 유형은 숫자 형식이어야 합니다.' })
    @IsIn([
        ReportTypeEnum.SPAM,
        ReportTypeEnum.HATE_SPEECH,
        ReportTypeEnum.INAPPROPRIATE,
        ReportTypeEnum.MISINFORMATION
    ], { message: `신고 유형은 1, 2, 3, 4 중 하나여야 합니다.` })
    @Type(() => Number)
    type: ReportTypeEnum;
}