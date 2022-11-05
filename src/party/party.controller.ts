import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { GatherInfosDto } from './dto/gather-info.dto';
import { RentalInfosDto } from './dto/rental-info.dto';
import { GatherDetailDto } from './dto/gather-detail.dto';
import { RentalDetailDto } from './dto/rental-detail.dto';

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
  @ApiOkResponse({ type: GatherInfosDto })
  async getGatherParties(
    @CurrentUser() user: User,
    @Query() query: OttQuery,
  ): Promise<GatherInfosDto> {
    return this.partyService.getGatherParties(user.id, query);
  }

  @Get('rental')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '대여 모집을 조회합니다.' })
  @ApiOkResponse({ type: RentalInfosDto })
  async getRentalParties(@CurrentUser() user: User, @Query() query: OttQuery) {
    return this.partyService.getRentalParties(user.id, query);
  }

  @Get('gather/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'id로 파티 모집을 조회합니다.' })
  @ApiOkResponse({ type: GatherDetailDto })
  async getGatherPartyDetail(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.partyService.getGatherPartyDetail(user.id, id);
  }

  @Get('rental/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'id로 대여 모집을 조회합니다.' })
  @ApiOkResponse({ type: RentalDetailDto })
  async getRentalPartyDetail(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.partyService.getRentalPartyDetail(user.id, id);
  }

  @Post('party/:id/participate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모집 또는 대여를 신청합니다.' })
  @ApiNoContentResponse()
  async applyParticipate(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.partyService.applyParticipate(user.id, id);
  }

  @Post('participate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모집 또는 대여를 승인합니다.' })
  @ApiNoContentResponse()
  async participate(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.partyService.participate(user.id, id);
  }
}
