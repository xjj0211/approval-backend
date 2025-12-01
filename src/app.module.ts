import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApprovalsController } from './approvals/approvals.controller';
import { ApprovalsService } from './approvals/approvals.service';

@Module({
  imports: [],
  controllers: [AppController, ApprovalsController],
  providers: [AppService, ApprovalsService],
})
export class AppModule {}
