import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.cookies?.access_token;

    if (!token && request.headers?.authorization) {
      const parts = request.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException('Sesi tidak valid atau belum login');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SESSION_SECRET || 'secretKey'
      });
      request['user'] = {
        ...payload,
        id: payload.sub,
      };
    } catch {
      throw new UnauthorizedException('Token kedaluwarsa atau tidak valid');
    }
    return true;
  }
}
