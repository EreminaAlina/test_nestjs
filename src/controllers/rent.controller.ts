import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Query,
  StreamableFile,
  UsePipes,
} from '@nestjs/common';
import { RentService } from '../services/rent.service';
import { CreateRentDto, CreateRentDtoSchema } from '../dto';
import { DatePipe, SchemaValidationPipe } from '../pipes';
import { Rent } from '../models';

@Controller('rent')
export class RentController {
  constructor(private rentService: RentService) {}

  @Get('available/:id')
  checkAvailability(@Param('id') id: string): Promise<boolean> {
    return this.rentService.checkAvailable(id);
  }

  @Post()
  @UsePipes(new SchemaValidationPipe(CreateRentDtoSchema))
  create(@Body() createDto: CreateRentDto): Promise<Rent> {
    return this.rentService.create(createDto);
  }

  @Get('calculate')
  getCalculation(
    @Query('startDate', DatePipe) startDate: Date,
    @Query('endDate', DatePipe) endDate: Date,
  ): Promise<number> {
    return this.rentService.getCalculation(startDate, endDate);
  }

  @Get('report')
  @Header('Content-Disposition', 'attachment; filename="report.xlsx"')
  getReport(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ): Promise<StreamableFile> {
    return this.rentService.getReport(month, year);
  }
}
