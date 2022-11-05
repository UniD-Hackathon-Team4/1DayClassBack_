import { Controller, Get, UseGuards } from '@nestjs/common';
import { ViewService } from './view.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/member.decorator';
import { User } from '@prisma/client';
import { MainViewDto } from './dto/main-view.dto';

@ApiTags('View API')
@Controller('api/view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get('main')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '메인화면에 필요한 데이터를 조회합니다.' })
  @ApiOkResponse({ type: MainViewDto })
  async getMainView(@CurrentUser() user: User): Promise<MainViewDto> {
    return this.viewService.getMainView(user.id);
  }
}
