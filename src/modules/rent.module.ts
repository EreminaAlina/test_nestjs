import { Module } from '@nestjs/common';
import { CarsController } from '../controllers/cars.controller';
import { RentService } from '../services/rent.service';

@Module({
  controllers: [CarsController],
  providers: [RentService],
})
export class RentModule {}
