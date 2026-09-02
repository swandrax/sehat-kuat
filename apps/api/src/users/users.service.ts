import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateLocation(userId: string, latitude: number, longitude: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { latitude, longitude }
    });
  }
}
