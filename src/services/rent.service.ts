import { BadRequestException, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { InjectClient } from 'nest-postgres';
import { CreateDto } from '../dto/create.dto';
import {
  getOverlappingDaysInIntervals,
  intervalToDuration,
  isWithinInterval,
} from 'date-fns';
import { Rent } from '../models/rent.model';

@Injectable()
export class RentService {
  constructor(@InjectClient() private readonly pg: Client) {}

  async createCarRent(createDto: CreateDto) {
    const { carId, startDate, endDate } = createDto;
    const startDay = new Date(startDate).getDay();
    const endDay = new Date(endDate).getDay();

    if ([0, 1].includes(startDay) || [0, 1].includes(endDay)) {
      throw new BadRequestException(
        'Начало и конец аренды не может выпадать на выходной день',
      );
    }

    const interval = intervalToDuration({
      start: new Date(startDate),
      end: new Date(endDate),
    }).days;

    if (interval < 1 || interval > 30) {
      throw new BadRequestException('Длительность сессии не больше 30 дней');
    }

    const car = await this.pg.query('SELECT * FROM cars WHERE id=$1', [carId]);
    if (!car.rows.length)
      throw new BadRequestException('Данная машина уже забронирована');

    const rent = await this.pg.query<Rent>(
      'SELECT * FROM rent WHERE carId=$1 ORDER BY endDate DESC LIMIT 1',
      [carId],
    );
    if (rent.rows.length) {
      const rentStart = new Date(rent.rows[0].startdate);
      const rentEnd = new Date(rent.rows[0].enddate);
      if (
        getOverlappingDaysInIntervals(
          { start: new Date(startDate), end: new Date(endDate) },
          {
            start: rentStart,
            end: rentEnd,
          },
        )
      ) {
        throw new BadRequestException('Машина уже забронирована на эти даты');
      }
      if (
        intervalToDuration({
          start: new Date(startDate),
          end: rentEnd,
        }).days < 3
      ) {
        throw new BadRequestException('Разница между сессиями меньше 3 дней ');
      }
    }

    return await this.pg.query(
      'INSERT INTO rent(carId, startDate, endDate) VALUES ($1, $2, $3)',
      [carId, startDate, endDate],
    );
  }

  async getCalculation(startDate: Date, endDate: Date): Promise<number> {
    const days = intervalToDuration({
      start: new Date(startDate),
      end: new Date(endDate),
    }).days;
    if (days > 30) {
      throw new BadRequestException('Аренда не должна быть больше 30 дней');
    }

    const tariff = 1000;
    let sum = 0;
    for (let i = 0; i < days; i++) {
      if (i < 4) {
        sum += tariff;
        continue;
      }
      if (i < 9) {
        sum += tariff - tariff * 0.05;
        continue;
      }
      if (i < 17) {
        sum += tariff - tariff * 0.1;
        continue;
      }
      if (i < 29) {
        sum += tariff - tariff * 0.15;
      }
    }
    return sum;
  }

  async checkAvailable(id: string): Promise<boolean> {
    const car = await this.pg.query('SELECT * FROM cars WHERE id=$1', [id]);

    if (!car.rows.length) return false;

    const rent = await this.pg.query<Rent>(
      'SELECT * FROM rent WHERE carId=$1 ORDER BY endDate [DESC] LIMIT 1',
      [id],
    );

    if (!rent.rows.length) return false;

    const now = new Date();
    const startDate = new Date(rent.rows[0].startdate);
    const endDate = new Date(rent.rows[0].enddate);

    if (isWithinInterval(now, { start: startDate, end: endDate })) return false;

    const days = intervalToDuration({
      start: now,
      end: endDate,
    }).days;

    if (days < 3) return false;
  }
}
