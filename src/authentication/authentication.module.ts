import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CompanyEntity } from 'src/user/entities/company.entity';
import { PartnerEntity } from 'src/user/entities/partner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CompanyEntity, PartnerEntity]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
