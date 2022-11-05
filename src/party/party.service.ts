import { Injectable } from '@nestjs/common';
import { PartyRepository } from './party.repository';
import { PartyPayload } from './payload/party.payload';
import { PartyCreateData } from './type/party-create-data.type';
import { PartyType } from '@prisma/client';

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
}
