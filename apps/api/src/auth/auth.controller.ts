import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setCookie(res, result.access_token);
    return {
      message: 'Registrasi berhasil',
      user: result.user,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setCookie(res, result.access_token);
    return {
      message: 'Login berhasil',
      user: result.user,
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout berhasil' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: any) {
    return this.authService.getCurrentUser(req.user.sub);
  }

  private setCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
