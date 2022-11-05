import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';
import { PartyRepository } from './party.repository';

@Module({
  controllers: [PartyController],
  providers: [PartyService, PartyRepository],
})
export class PartyModule {}
