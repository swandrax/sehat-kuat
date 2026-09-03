import { Module } from '@nestjs/common';
import { AutraService } from './autra.service';
import { AutraController } from './autra.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AutraController],
  providers: [AutraService],
  exports: [AutraService],
})
export class AutraModule {}
