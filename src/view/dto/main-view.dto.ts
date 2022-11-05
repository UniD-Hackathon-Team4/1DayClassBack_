import { GatherInfoDto } from '../../party/dto/gather-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PartyDetailData } from '../../party/type/party-detail-data.type';

export class MainViewDto {
  @ApiProperty({ type: [GatherInfoDto] })
  gatherParties!: GatherInfoDto[];

  static of(gatherPartyData: PartyDetailData[], userId: number): MainViewDto {
    const gatherParties = gatherPartyData.map((party) =>
      GatherInfoDto.of(party, party.user.id === userId),
    );
    return { gatherParties };
  }
}
