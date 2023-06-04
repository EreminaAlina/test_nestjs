import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { CreateRentDto } from '../dto';
import {
  endOfMonth,
  getOverlappingDaysInIntervals,
  intervalToDuration,
  isWeekend,
  isWithinInterval,
} from 'date-fns';
import { Rent, RentCarJoin } from '../models';
import { utils, write } from 'xlsx';
import { RentRepositoryService } from '../repositories/rent.repository';
import { average, calculateTariff } from '../utils/utils';

@Injectable()
export class RentService {
  constructor(private readonly _rentRepository: RentRepositoryService) {}

  async create(createDto: CreateRentDto): Promise<Rent> {
    const { carId, startDate, endDate } = createDto;

    if (isWeekend(startDate) || isWeekend(endDate)) {
      throw new BadRequestException(
        'Начало и конец аренды не может выпадать на выходной день',
      );
    }

    const interval = intervalToDuration({
      start: startDate,
      end: endDate,
    }).days;

    if (interval < 1 || interval > 30) {
      throw new BadRequestException('Длительность сессии не больше 30 дней');
    }

    const rent = await this._rentRepository.findByCarId(carId);
    if (rent) {
      if (
        getOverlappingDaysInIntervals(
          { start: startDate, end: endDate },
          {
            start: rent.startdate,
            end: rent.enddate,
          },
        )
      ) {
        throw new BadRequestException('Машина уже забронирована на эти даты');
      }
      if (
        intervalToDuration({
          start: startDate,
          end: rent.enddate,
        }).days < 3
      ) {
        throw new BadRequestException('Разница между сессиями меньше 3 дней ');
      }
    }

    return await this._rentRepository.create(createDto);
  }

  async getCalculation(startDate: Date, endDate: Date): Promise<number> {
    const days = intervalToDuration({
      start: startDate,
      end: endDate,
    }).days;
    if (days > 30) {
      throw new BadRequestException('Аренда не должна быть больше 30 дней');
    }

    return calculateTariff(1000, days);
  }

  async checkAvailable(id: string): Promise<boolean> {
    const rent = await this._rentRepository.findByCarId(id);

    if (!rent) return true;

    const now = new Date();

    if (isWithinInterval(now, { start: rent.startdate, end: rent.enddate }))
      return false;

    const days = intervalToDuration({
      start: now,
      end: rent.enddate,
    }).days;

    return days > 3;
  }

  async getReport(month: number, year: number): Promise<StreamableFile> {
    const startMonth = new Date(year, month, 1, 0, 0);
    const endMonth = endOfMonth(startMonth);
    const rents = await this._rentRepository.getRentCarsJoin(endMonth);
    const rentMap = this._getCarsRentMap(rents, startMonth, endMonth);

    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([
      ['Госномер', 'Средняя загрузка, %'],
      ...rentMap.entries(),
      ['Итого', average([...rentMap.values()])],
    ]);
    utils.book_append_sheet(wb, ws);

    const buf = write(wb, { type: 'buffer', bookType: 'csv' });
    return new StreamableFile(buf);
  }

  private _getCarsRentMap(
    rents: RentCarJoin[],
    startMonth: Date,
    endMonth: Date,
  ): Map<string, number> {
    const map = new Map<string, number>();
    for (const rent of rents) {
      let days = 0;

      if (rent.startdate && rent.enddate) {
        days = getOverlappingDaysInIntervals(
          { start: rent.startdate, end: rent.enddate },
          {
            start: startMonth,
            end: endMonth,
          },
        );
      }

      const value = map.get(rent.regnumber) ?? 0;
      map.set(rent.regnumber, value + days);
    }

    for (const [key, value] of map) {
      map.set(key, (value / 30) * 100);
    }

    return map;
  }
}
