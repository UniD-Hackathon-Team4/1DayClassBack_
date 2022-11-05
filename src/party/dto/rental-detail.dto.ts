import { ParticipantDto } from './participant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RentalInfoDto } from './rental-info.dto';
import { PartyDetailData } from '../type/party-detail-data.type';

export class RentalDetailDto extends RentalInfoDto {
  @ApiProperty({ type: [ParticipantDto] })
  participants!: ParticipantDto[];

  static of(
    partyDetailData: PartyDetailData,
    isOwner: boolean,
  ): RentalDetailDto {
    return {
      ...RentalInfoDto.of(partyDetailData, isOwner),
      participants: partyDetailData.participate.map((participate) =>
        ParticipantDto.of(participate),
      ),
    };
  }
}
