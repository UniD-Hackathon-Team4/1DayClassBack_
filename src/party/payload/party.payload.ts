import { OttType } from '@prisma/client';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PartyPayload {
  @IsEnum(OttType)
  @ApiProperty({ enum: OttType })
  ott!: OttType;

  @IsString()
  @ApiProperty({ type: String })
  title!: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({ description: '시작날짜', type: String, example: '2021-01-01' })
  startDate!: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({ description: '종료날짜', type: String, example: '2021-01-01' })
  endDate?: Date;

  @IsInt()
  @ApiProperty({ type: Number })
  numOfPeople!: number;

  @IsInt()
  @ApiProperty({ type: Number })
  cost!: number;
}
