import { coerce, date, nullable, object, string } from 'superstruct';

export class RentCarJoin {
  regnumber: string;
  startdate: Date;
  enddate: Date;
}

export const RentCarJoinSchema = object({
  regnumber: string(),
  startdate: nullable(coerce(date(), string(), (value) => new Date(value))),
  enddate: nullable(coerce(date(), string(), (value) => new Date(value))),
});
