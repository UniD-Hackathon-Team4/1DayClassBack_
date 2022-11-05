import { Injectable, NotFoundException } from '@nestjs/common';
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
}
