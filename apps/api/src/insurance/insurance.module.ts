import { Module } from '@nestjs/common';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';
import { AutraModule } from '../autra/autra.module';
import { FdsModule } from '../fds/fds.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AutraModule, FdsModule, JwtModule],
  controllers: [InsuranceController],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}
