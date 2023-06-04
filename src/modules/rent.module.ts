import { Module } from '@nestjs/common';
import { RentService } from '../services/rent.service';
import { RentController } from '../controllers/rent.controller';
import { RentRepositoryService } from '../repositories/rent.repository';

@Module({
  controllers: [RentController],
  providers: [RentService, RentRepositoryService],
})
export class RentModule {}
