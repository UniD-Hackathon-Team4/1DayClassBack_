import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PartyService } from './party.service';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/member.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PartyPayload } from './payload/party.payload';
import { OttQuery } from './query/ott.query';
import { GatherDetailsDto } from './dto/gather-detail.dto';

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

  @Get('gather')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '파티 모집을 조회합니다.' })
  @ApiOkResponse()
  async getGatherParties(
    @CurrentUser() user: User,
    @Query() query: OttQuery,
  ): Promise<GatherDetailsDto> {
    return this.partyService.getGatherParties(user.id, query);
  }

  @Get('rental')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '대여 모집을 조회합니다.' })
  @ApiOkResponse()
  async getRentalParties(@CurrentUser() user: User, @Query() query: OttQuery) {
    return this.partyService.getRentalParties(user.id, query);
  }
}
