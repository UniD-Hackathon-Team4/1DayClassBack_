import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { PartyCreateData } from './type/party-create-data.type';

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
}
