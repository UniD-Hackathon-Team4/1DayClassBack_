import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupPayload } from './payload/signup.payload';
import { LoginPayload } from './payload/login.payload';
import { TokenDto } from './dto/token.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CurrentUser } from './decorator/member.decorator';
import { User } from '@prisma/client';

@ApiTags('Auth API')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: '회원가입합니다.' })
  @ApiCreatedResponse({ type: TokenDto })
  async signUp(@Body() payload: SignupPayload): Promise<TokenDto> {
    return this.authService.signUp(payload);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인합니다.' })
  @ApiOkResponse({ type: TokenDto })
  async login(@Body() payload: LoginPayload): Promise<TokenDto> {
    return this.authService.login(payload);
  }

  @Get('test')
  @ApiOperation({ summary: '테스트' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async test(@CurrentUser() user: User) {
    return user.id;
  }
}
