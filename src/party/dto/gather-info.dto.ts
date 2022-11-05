import { ApiProperty } from '@nestjs/swagger';
import { OttType, PartyType } from '@prisma/client';
import { PartyDetailData } from '../type/party-detail-data.type';

export class GatherInfoDto {
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

  static of(partyDetailData: PartyDetailData, isOwner: boolean): GatherInfoDto {
    return {
      partyId: partyDetailData.id,
      authorName: partyDetailData.user.nickname,
      title: partyDetailData.title,
      startDate: partyDetailData.startDate.toISOString(),
      endDate: partyDetailData.endDate?.toISOString() ?? null,
      numOfPeople: partyDetailData.numOfPeople,
      joinedPeopleCount:
        partyDetailData.participate.filter(
          (participate) => participate.isSelected,
        ).length + 1,
      cost: partyDetailData.cost,
      ott: partyDetailData.ott,
      type: partyDetailData.type,
      isOwner,
    };
  }
}

export class GatherInfosDto {
  @ApiProperty({ type: [GatherInfoDto] })
  parties!: GatherInfoDto[];

  static of(
    partyDetailData: PartyDetailData[],
    userId: number,
  ): GatherInfosDto {
    const parties = partyDetailData.map((party) =>
      GatherInfoDto.of(party, party.user.id === userId),
    );
    return { parties };
  }
}
