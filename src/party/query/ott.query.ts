import { IsEnum, IsOptional } from 'class-validator';
import { OttType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OttQuery {
  @IsOptional()
  @IsEnum(OttType)
  @ApiPropertyOptional({ enum: OttType })
  ott?: OttType;
}
