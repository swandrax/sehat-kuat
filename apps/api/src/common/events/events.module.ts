import { Global, Module } from '@nestjs/common';
import { AppEventsService } from './events.service';

@Global()
@Module({
  providers: [AppEventsService],
  exports: [AppEventsService],
})
export class EventsModule {}
