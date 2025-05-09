import { Module } from '@nestjs/common';
import { NecordService } from './necord.service';
import { NecordController } from './necord.controller';

@Module({
  providers: [NecordService],
  controllers: [NecordController]
})
export class NecordModule {}
