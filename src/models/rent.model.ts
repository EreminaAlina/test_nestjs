import { coerce, date, object, string } from 'superstruct';

export class Rent {
  id: string;
  carid: string;
  startdate: Date;
  enddate: Date;
}

export const RentSchema = object({
  id: string(),
  carid: string(),
  startdate: coerce(date(), string(), (value) => new Date(value)),
  enddate: coerce(date(), string(), (value) => new Date(value)),
});
