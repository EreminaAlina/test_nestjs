import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): Date {
    return new Date(value);
  }
}
