import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignupData } from './type/signup-data.type';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createUser(data: SignupData): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        contact: data.contact,
      },
    });
  }
}
