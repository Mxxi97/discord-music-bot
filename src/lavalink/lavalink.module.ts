import { Module } from '@nestjs/common';
import { LavalinkController } from './lavalink.controller';
import { LavalinkService } from './lavalink.service';

@Module({
  controllers: [LavalinkController],
  providers: [LavalinkService],
})
export class LavalinkModule {}
