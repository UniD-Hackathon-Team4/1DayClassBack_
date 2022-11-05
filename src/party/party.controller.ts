import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PartyService } from './party.service';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/member.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PartyPayload } from './payload/party.payload';

@ApiTags('Party API')
@Controller('api/party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post('gather')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '파티 모집을 만듭니다.' })
  @ApiNoContentResponse()
  async createGather(
    @CurrentUser() user: User,
    @Body() payload: PartyPayload,
  ): Promise<void> {
    return this.partyService.createGather(user.id, payload);
  }

  @Post('rental')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '대여 모집을 만듭니다.' })
  @ApiNoContentResponse()
  async createRental(
    @CurrentUser() user: User,
    @Body() payload: PartyPayload,
  ): Promise<void> {
    return this.partyService.createRental(user.id, payload);
  }
}
