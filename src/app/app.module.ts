import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { configModule } from '../common/config/config.module';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { PartyModule } from '../party/party.module';
import { ViewModule } from '../view/view.module';

@Module({
  imports: [configModule, CommonModule, AuthModule, PartyModule, ViewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
