import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface AppEvent {
  type: 'QUEUE_UPDATED' | 'NOTIFICATION_CREATED' | 'APPOINTMENT_STATUS_CHANGED' | 'CLAIM_STATUS_UPDATE';
  targetId?: string; // doctorId or userId
  payload: any;
}

@Injectable()
export class AppEventsService {
  private eventSubject = new Subject<AppEvent>();

  emit(event: AppEvent) {
    this.eventSubject.next(event);
  }

  // Stream queue updates for a specific doctor
  getQueueStream(doctorId: string): Observable<MessageEvent> {
    return this.eventSubject.asObservable().pipe(
      filter(
        (event) =>
          event.type === 'QUEUE_UPDATED' &&
          (!doctorId || event.targetId === doctorId || event.targetId === 'ALL'),
      ),
      map((event) => ({
        data: event.payload,
        type: 'queue-update',
      } as MessageEvent)),
    );
  }

  // Stream notifications for a specific user
  getNotificationStream(userId: string): Observable<MessageEvent> {
    return this.eventSubject.asObservable().pipe(
      filter(
        (event) =>
          event.type === 'NOTIFICATION_CREATED' &&
          (event.targetId === userId || event.targetId === 'ALL'),
      ),
      map((event) => ({
        data: event.payload,
        type: 'notification',
      } as MessageEvent)),
    );
  }
}
