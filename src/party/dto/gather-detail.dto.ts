import { ApiProperty } from '@nestjs/swagger';
import { OttType, PartyType } from '@prisma/client';
import { PartyDetailData } from '../type/party-detail-data.type';

export class GatherDetailDto {
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
  numOfPeople!: number;

  @ApiProperty({ type: Number })
  joinedPeopleCount!: number;

  @ApiProperty({ enum: PartyType })
  type!: PartyType;

  @ApiProperty({ type: Number })
  cost!: number;

  @ApiProperty({ enum: OttType })
  ott!: OttType;

  @ApiProperty({ type: Boolean })
  isOwner!: boolean;

  static of(
    partyDetailData: PartyDetailData,
    isOwner: boolean,
  ): GatherDetailDto {
    return {
      partyId: partyDetailData.id,
      authorName: partyDetailData.user.nickname,
      title: partyDetailData.title,
      startDate: partyDetailData.startDate.toISOString(),
      endDate: partyDetailData.endDate?.toISOString() ?? null,
      numOfPeople: partyDetailData.numOfPeople,
      joinedPeopleCount: partyDetailData.participate.filter(
        (participate) => participate.isSelected,
      ).length,
      cost: partyDetailData.cost,
      ott: partyDetailData.ott,
      type: partyDetailData.type,
      isOwner,
    };
  }
}

export class GatherDetailsDto {
  @ApiProperty({ type: [GatherDetailDto] })
  parties!: GatherDetailDto[];

  static of(
    partyDetailData: PartyDetailData[],
    userId: number,
  ): GatherDetailsDto {
    const parties = partyDetailData.map((party) =>
      GatherDetailDto.of(party, party.user.id === userId),
    );
    return { parties };
  }
}
