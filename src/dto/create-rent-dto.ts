import { coerce, date, object, string } from 'superstruct';

export class CreateRentDto {
  carId: string;
  startDate: Date;
  endDate: Date;
}

export const CreateRentDtoSchema = object({
  carId: string(),
  startDate: coerce(date(), string(), (value) => new Date(value)),
  endDate: coerce(date(), string(), (value) => new Date(value)),
});
