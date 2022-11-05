import { ApiProperty } from '@nestjs/swagger';
import { OttType, PartyType } from '@prisma/client';
import { PartyDetailData } from '../type/party-detail-data.type';

export class RentalDetailDto {
  @ApiProperty({ type: Number })
  partyId!: number;

  @ApiProperty({ type: String })
  authorName!: string;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String })
  startDate!: string;

  @ApiProperty({ type: String, nullable: true })
  endDate!: string | null;

  @ApiProperty({ type: Number })
  cost!: number;

  @ApiProperty({ enum: OttType })
  ott!: OttType;

  @ApiProperty({ enum: PartyType })
  type!: PartyType;

  @ApiProperty({ type: Boolean })
  isOwner!: boolean;

  static of(
    partyDetailData: PartyDetailData,
    isOwner: boolean,
  ): RentalDetailDto {
    return {
      partyId: partyDetailData.id,
      authorName: partyDetailData.user.nickname,
      title: partyDetailData.title,
      startDate: partyDetailData.startDate.toISOString(),
      endDate: partyDetailData.endDate?.toISOString() ?? null,
      cost: partyDetailData.cost,
      ott: partyDetailData.ott,
      type: partyDetailData.type,
      isOwner,
    };
  }
}

export class RentalDetailsDto {
  @ApiProperty({ type: [RentalDetailDto] })
  parties!: RentalDetailDto[];

  static of(
    partyDetailData: PartyDetailData[],
    userId: number,
  ): RentalDetailsDto {
    const parties = partyDetailData.map((party) =>
      RentalDetailDto.of(party, party.user.id === userId),
    );
    return { parties };
  }
}
