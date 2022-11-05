import { GatherInfoDto } from './gather-info.dto';
import { ParticipantDto } from './participant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PartyDetailData } from '../type/party-detail-data.type';

export class GatherDetailDto extends GatherInfoDto {
  @ApiProperty({ type: [ParticipantDto] })
  participants!: ParticipantDto[];

  static of(
    partyDetailData: PartyDetailData,
    isOwner: boolean,
  ): GatherDetailDto {
    return {
      ...GatherInfoDto.of(partyDetailData, isOwner),
      participants: partyDetailData.participate.map((participate) =>
        ParticipantDto.of(participate),
      ),
    };
  }
}
