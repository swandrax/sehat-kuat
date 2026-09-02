import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateLocationDto } from './dto/location.dto';

@Controller('api/v1/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('location')
  async updateLocation(@Request() req: any, @Body() dto: UpdateLocationDto) {
    await this.usersService.updateLocation(req.user.sub, dto.latitude, dto.longitude);
    return { success: true, message: 'Location updated successfully' };
  }
}
