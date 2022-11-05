import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PartyRepository } from './party.repository';
import { PartyPayload } from './payload/party.payload';
import { PartyCreateData } from './type/party-create-data.type';
import { PartyType } from '@prisma/client';
import { OttQuery } from './query/ott.query';
import { GatherInfosDto } from './dto/gather-info.dto';
import { PartyDetailData } from './type/party-detail-data.type';
import { RentalInfosDto } from './dto/rental-info.dto';
import { GatherDetailDto } from './dto/gather-detail.dto';
import { RentalDetailDto } from './dto/rental-detail.dto';

@Injectable()
export class PartyService {
  constructor(private readonly partyRepository: PartyRepository) {}

  async createGather(userId: number, payload: PartyPayload): Promise<void> {
    const createData: PartyCreateData = {
      title: payload.title,
      type: PartyType.GATHER,
      startDate: payload.startDate,
      endDate: payload.endDate,
      ott: payload.ott,
      numOfPeople: payload.numOfPeople,
      cost: payload.cost,
    };

    return this.partyRepository.createParty(userId, createData);
  }

  async createRental(userId: number, payload: PartyPayload): Promise<void> {
    const createData: PartyCreateData = {
      title: payload.title,
      type: PartyType.RENTAL,
      startDate: payload.startDate,
      endDate: payload.endDate,
      ott: payload.ott,
      numOfPeople: payload.numOfPeople,
      cost: payload.cost,
    };

    return this.partyRepository.createParty(userId, createData);
  }

  async getGatherParties(
    userId: number,
    query: OttQuery,
  ): Promise<GatherInfosDto> {
    const partyData: PartyDetailData[] = await this.partyRepository.getParties(
      query,
      PartyType.GATHER,
    );

    return GatherInfosDto.of(partyData, userId);
  }

  async getRentalParties(
    userId: number,
    query: OttQuery,
  ): Promise<RentalInfosDto> {
    const partyData: PartyDetailData[] = await this.partyRepository.getParties(
      query,
      PartyType.RENTAL,
    );

    return RentalInfosDto.of(partyData, userId);
  }

  async getGatherPartyDetail(
    userId: number,
    partyId: number,
  ): Promise<GatherDetailDto> {
    const partyData: PartyDetailData | null =
      await this.partyRepository.getPartyDetail(partyId);

    if (!partyData || partyData.type !== PartyType.GATHER) {
      throw new NotFoundException('존재하지 않는 파티 모집입니다.');
    }

    return GatherDetailDto.of(partyData, userId === partyData.user.id);
  }

  async getRentalPartyDetail(
    userId: number,
    partyId: number,
  ): Promise<RentalDetailDto> {
    const partyData: PartyDetailData | null =
      await this.partyRepository.getPartyDetail(partyId);

    if (!partyData || partyData.type !== PartyType.RENTAL) {
      throw new NotFoundException('존재하지 않는 대여 모집입니다.');
    }

    return RentalDetailDto.of(partyData, userId === partyData.user.id);
  }

  async applyParticipate(userId: number, partyId: number): Promise<void> {
    const partyData: PartyDetailData | null =
      await this.partyRepository.getPartyDetail(partyId);

    if (!partyData) {
      throw new NotFoundException('존재하지 않는 파티입니다.');
    }

    if (partyData.user.id === userId) {
      throw new ConflictException('자신이 만든 파티에는 신청할 수 없습니다.');
    }

    if (
      partyData.participate.some(
        (participate) => participate.user.id === userId,
      )
    ) {
      throw new ConflictException('이미 신청한 파티입니다.');
    }

    if (partyData.isCompleted) {
      throw new ConflictException('모집이 완료된 파티입니다.');
    }

    await this.partyRepository.applyParticipate(partyId, userId);
  }

  async participate(userId: number, participateId: number): Promise<void> {
    const partyData: PartyDetailData | null =
      await this.partyRepository.getPartyDetailByParticipateId(participateId);

    if (!partyData) {
      throw new NotFoundException('존재하지 않는 파티입니다.');
    }

    if (partyData.participate.some((participate) => participate.isSelected)) {
      throw new ConflictException('이미 승인된 참가자입니다.');
    }

    if (partyData.user.id !== userId) {
      throw new ConflictException('본인만 신청을 승인할 수 있습니다');
    }

    if (!this.canParticipate(partyData)) {
      throw new ConflictException('인원이 모두 찼습니다.');
    }

    // 파티가 완료되었다면 완료처리
    if (this.checkCompleted(partyData)) {
      await this.partyRepository.setCompleted(partyData.id);
    }

    // 참여처리
    await this.partyRepository.participate(participateId);
  }

  private canParticipate(partyData: PartyDetailData): boolean {
    // 선택된 참여자들만 필터링
    const selectedParticipates = partyData.participate.filter(
      (participate) => participate.isSelected,
    );

    // type이 Rental인 경우에는 이미 참여한 사람이 있으면 참여할 수 없다.
    if (partyData.type === PartyType.RENTAL) {
      return selectedParticipates.length === 0;
    }

    // type이 Gather인 경우에는 이미 참여한 사람보다 모집 인원이 많아야 참여할 수 있다.
    return selectedParticipates.length + 1 < partyData.numOfPeople;
  }

  private checkCompleted(partyData: PartyDetailData): boolean {
    const selectedParticipates = partyData.participate.filter(
      (participate) => participate.isSelected,
    );

    if (partyData.type === PartyType.RENTAL) {
      return true;
    }

    return selectedParticipates.length + 2 === partyData.numOfPeople;
  }
}
