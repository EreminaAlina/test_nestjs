import { Controller, Get, Header, Query } from '@nestjs/common';
import { RentService } from '../services/rent.service';

@Controller('rent')
export class RentController {
  constructor(private rentService: RentService) {}

  @Get()
  getCalculation(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.rentService.getCalculation(startDate, endDate);
  }

  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="report.xlsx"')
  getReport(@Query('month') month: number, @Query('year') year: number) {
    return this.rentService.getReport(month, year);
  }
}
