import { BadRequestException, Injectable } from "@nestjs/common";
import { Client } from "pg";
import { InjectClient } from "nest-postgres";
import { CreateDto } from "../dto/create.dto";
import { intervalToDuration } from "date-fns";
import { Rent } from "../models/rent.model";

@Injectable()
export class RentService {
  constructor(@InjectClient() private readonly pg: Client) {}

  public async createCarRent(createDto: CreateDto) {
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
    const car = await this.pg.query('SELECT * FROM cars WHERE id=$1', [
      carId,
    ]);
    if (car.rows.length) {
      const rent = await this.pg.query<Rent>(
        'SELECT * FROM rent WHERE carId=$1',
        [carId],
      );
      if (
        rent.rows.length &&
        intervalToDuration({
          start: new Date(startDate),
          end: new Date(rent.rows[0].id),
        }).days < 3
      ) {
        throw new BadRequestException('Разница между сессиями меньше 3 дней');
      }
      return await this.pg.query(
        'INSERT INTO rent(carId, startDate, endDate) VALUES ($1, $2, $3)',
        [carId, startDate, endDate],
      );
    }
    throw new BadRequestException('Машина с таким id не найдена');
  }
}
