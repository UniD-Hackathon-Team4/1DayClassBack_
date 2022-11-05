import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginPayload } from './payload/login.payload';
import { SignupPayload } from './payload/signup.payload';
import { TokenDto } from './dto/token.dto';
import { AuthRepository } from './auth.repository';
import { compare, genSalt, hash } from 'bcryptjs';
import { User } from '@prisma/client';
import { SignupData } from './type/signup-data.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async signUp(payload: SignupPayload): Promise<TokenDto> {
    const user = await this.authRepository.findUserByEmail(payload.email);

    if (user) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');
    }

    const signupData: SignupData = {
      email: payload.email,
      password: await this.getEncryptPassword(payload.password),
      nickname: payload.nickname,
      contact: payload.contact,
    };

    const createdUser: User = await this.authRepository.createUser(signupData);
    const token = await this.createAccessToken(createdUser.id);
    return { accessToken: token };
  }

  async login(payload: LoginPayload): Promise<TokenDto> {
    const user: User | null = await this.authRepository.findUserByEmail(
      payload.email,
    );

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }

    const loginResult = await this.validatePassword(
      payload.password,
      user.password,
    );

    if (!loginResult) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const token = await this.createAccessToken(user.id);
    return { accessToken: token };
  }

  async createAccessToken(userId: number): Promise<string> {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: this.config.get('JWT_ACCESS_TOKEN_KEY'),
        expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  async getEncryptPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
