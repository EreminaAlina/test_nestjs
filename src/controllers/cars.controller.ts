import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDto } from '../dto/create.dto';
import { RentService } from '../services/rent.service';

@Controller('cars')
export class CarsController {
  constructor(private rentService: RentService) {}

  @Get(':id')
  checkAvailability(@Param('id') id: number): boolean {
    return false;
  }

  @Post()
  create(@Body() createDto: CreateDto) {
    return this.rentService.createCarRent(createDto);
  }
}
