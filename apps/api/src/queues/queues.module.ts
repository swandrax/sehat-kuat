import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QueuesService],
  controllers: [QueuesController],
  exports: [QueuesService],
})
export class QueuesModule {}
