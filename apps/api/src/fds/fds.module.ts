import { Module } from '@nestjs/common';
import { FdsService } from './fds.service';

@Module({
  providers: [FdsService],
  exports: [FdsService],
})
export class FdsModule {}
