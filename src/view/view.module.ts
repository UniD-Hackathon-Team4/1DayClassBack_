import { Module } from '@nestjs/common';
import { ViewService } from './view.service';
import { ViewController } from './view.controller';
import { PartyModule } from '../party/party.module';

@Module({
  imports: [PartyModule],
  providers: [ViewService],
  controllers: [ViewController],
})
export class ViewModule {}
