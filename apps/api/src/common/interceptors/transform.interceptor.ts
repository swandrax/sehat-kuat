import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        // If response already matches standard envelope
        if (response && typeof response === 'object' && 'success' in response) {
          return response;
        }

        // If response includes meta (e.g. pagination)
        if (response && typeof response === 'object' && 'data' in response && 'meta' in response) {
          return {
            success: true,
            data: response.data,
            meta: response.meta,
          };
        }

        return {
          success: true,
          data: response,
        };
      }),
    );
  }
}
