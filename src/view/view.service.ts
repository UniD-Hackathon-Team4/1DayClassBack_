import { Injectable } from '@nestjs/common';
import { PartyRepository } from '../party/party.repository';
import { MainViewDto } from './dto/main-view.dto';

@Injectable()
export class ViewService {
  constructor(private readonly partyRepository: PartyRepository) {}

  async getMainView(userId: number): Promise<MainViewDto> {
    const gatherPartyData = await this.partyRepository.getMyGatherParties(
      userId,
    );

    return MainViewDto.of(gatherPartyData, userId);
  }
}
