import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { PartyCreateData } from './type/party-create-data.type';
import { PartyType } from '@prisma/client';
import { OttQuery } from './query/ott.query';
import { PartyDetailData } from './type/party-detail-data.type';

const commonPartySelect = {
  id: true,
  title: true,
  startDate: true,
  endDate: true,
  numOfPeople: true,
  type: true,
  cost: true,
  ott: true,
  isCompleted: true,
  user: {
    select: {
      id: true,
      nickname: true,
    },
  },
  participate: {
    select: {
      id: true,
      isSelected: true,
      user: {
        select: {
          id: true,
          nickname: true,
          contact: true,
        },
      },
    },
  },
};

@Injectable()
export class PartyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createParty(userId: number, data: PartyCreateData): Promise<void> {
    await this.prisma.party.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getParties(
    query: OttQuery,
    type: PartyType,
  ): Promise<PartyDetailData[]> {
    const { ott } = query;
    return this.prisma.party.findMany({
      where: {
        ott,
        type,
        isCompleted: false,
      },
      select: commonPartySelect,
    });
  }

  async getPartyDetail(id: number): Promise<PartyDetailData | null> {
    return this.prisma.party.findUnique({
      where: {
        id,
      },
      select: commonPartySelect,
    });
  }

  async getPartyDetailByParticipateId(
    participateId: number,
  ): Promise<PartyDetailData | null> {
    return this.prisma.party.findFirst({
      where: {
        participate: {
          some: {
            id: participateId,
          },
        },
      },
      select: commonPartySelect,
    });
  }

  async getMyGatherParties(userId: number): Promise<PartyDetailData[]> {
    const madeByMe = await this.prisma.party.findMany({
      where: {
        userId,
        type: PartyType.GATHER,
      },
      select: commonPartySelect,
    });

    const participated = await this.prisma.party.findMany({
      where: {
        type: PartyType.GATHER,
        participate: {
          some: {
            userId,
          },
        },
      },
      select: commonPartySelect,
    });

    return [...madeByMe, ...participated];
  }

  async setCompleted(partyId: number): Promise<void> {
    await this.prisma.party.update({
      where: {
        id: partyId,
      },
      data: {
        isCompleted: true,
      },
    });
  }

  async participate(participateId: number): Promise<void> {
    await this.prisma.participate.update({
      where: {
        id: participateId,
      },
      data: {
        isSelected: true,
      },
    });
  }

  async applyParticipate(partyId: number, userId: number): Promise<void> {
    await this.prisma.participate.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        party: {
          connect: {
            id: partyId,
          },
        },
      },
    });
  }

  async deleteParty(partyId: number): Promise<void> {
    await this.prisma.participate.deleteMany({
      where: {
        partyId,
      },
    });

    await this.prisma.party.delete({
      where: {
        id: partyId,
      },
    });
  }
}
