import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { PartyCreateData } from './type/party-create-data.type';
import { PartyType } from '@prisma/client';
import { OttQuery } from './query/ott.query';
import { PartyDetailData } from './type/party-detail-data.type';

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
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        numOfPeople: true,
        type: true,
        cost: true,
        ott: true,
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        participate: {
          select: {
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
      },
    });
  }
}
