import { Injectable } from '@nestjs/common';
import { Rent, RentCarJoin, RentCarJoinSchema, RentSchema } from '../models';
import { InjectClient } from 'nest-postgres';
import { Client } from 'pg';
import { CreateRentDto } from '../dto';
import { create } from 'superstruct';

@Injectable()
export class RentRepositoryService {
  constructor(@InjectClient() private readonly _pg: Client) {}

  async create(model: CreateRentDto): Promise<Rent> {
    const query = await this._pg.query<Rent>(
      'INSERT INTO rent(carId, startDate, endDate) VALUES ($1, $2, $3) RETURNING *',
      [model.carId, model.startDate, model.endDate],
    );

    return create(query.rows[0], RentSchema);
  }

  async findByCarId(carId: string): Promise<Rent | null> {
    const query = await this._pg.query<Rent>(
      'SELECT * FROM rent WHERE carId=$1 ORDER BY endDate DESC LIMIT 1',
      [carId],
    );

    return query.rows[0] ? create(query.rows[0], RentSchema) : null;
  }

  async getRentCarsJoin(endMonth: Date): Promise<RentCarJoin[]> {
    const rents = await this._pg.query<RentCarJoin>(
      'SELECT cars.regnumber, rent.startdate, rent.enddate FROM rent RIGHT JOIN cars ON rent.carid = cars.id WHERE rent.enddate < $1 OR rent.enddate IS NULL ORDER BY enddate DESC',
      [endMonth],
    );

    return rents.rows.map((join) => create(join, RentCarJoinSchema));
  }
}
