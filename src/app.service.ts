import { Injectable } from '@nestjs/common';
import { InjectClient } from 'nest-postgres';
import { Client } from 'pg';

@Injectable()
export class AppService {
  constructor(@InjectClient() private readonly pg: Client) {}
  public async createTablesIfNotExist() {
    try {
      await this.pg.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await this.pg.query(
        'CREATE TABLE IF NOT EXISTS cars (id uuid DEFAULT uuid_generate_v4 (), regNumber text NOT NULL, PRIMARY KEY (id))',
      );
      const carsRows = await this.pg.query('SELECT * FROM cars');
      if (!carsRows.rows.length) {
        const cars = ['С902УН', 'М458РМ', 'Х569УР', 'Е025НА', 'С476РО'];
        for (const car of cars) {
          await this.pg.query('INSERT INTO cars(regNumber) VALUES ($1)', [car]);
        }
      }
      await this.pg.query(
        'CREATE TABLE IF NOT EXISTS rent (id uuid DEFAULT uuid_generate_v4 (), carId uuid, FOREIGN KEY(carId) REFERENCES cars(id), startDate date NOT NULL, endDate date NOT NULL, PRIMARY KEY (id))',
      );
    } catch (e) {
      console.log(e);
    }
  }
}
