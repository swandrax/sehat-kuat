import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RoleType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Find role
    let role = await this.prisma.role.findUnique({
      where: { name: dto.role },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: { name: dto.role },
      });
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    // Create associated profile based on role
    if (user.role.name === RoleType.PATIENT) {
      await this.prisma.patient.create({
        data: { userId: user.id },
      });
    } else if (user.role.name === RoleType.DOCTOR) {
      await this.prisma.doctor.create({
        data: {
          userId: user.id,
          specialization: 'Dokter Umum',
        },
      });
    }

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_CREATED',
        resource: 'User',
        details: { email: user.email, role: user.role.name },
      },
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email atau kata sandi tidak valid');
    }

    const isValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Email atau kata sandi tidak valid');
    }

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        resource: 'Auth',
        details: { email: user.email },
      },
    });

    return this.generateToken(user);
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        patient: true,
        doctor: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    };
  }
}
