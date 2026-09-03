import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Idempotency applies to state-mutating requests
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const idempotencyKey =
        request.headers['idempotency-key'] ||
        request.headers['x-idempotency-key'];

      if (idempotencyKey) {
        const key = `idempotency:${idempotencyKey}`;
        // TTL of 60 seconds prevents concurrent double-clicks and replayed submissions
        const acquired = await this.redis.setnx(key, 'PROCESSING', 60);

        if (!acquired) {
          throw new ConflictException(
            'Permintaan duplikat terdeteksi (Idempotency Key conflict). Transaksi ini sedang atau telah diproses.',
          );
        }
      }
    }

    return true;
  }
}
