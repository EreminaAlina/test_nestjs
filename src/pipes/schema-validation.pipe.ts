import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { create, Struct } from 'superstruct';

@Injectable()
export class SchemaValidationPipe<T> implements PipeTransform {
  constructor(private readonly _struct: Struct<T>) {}

  transform(value: T, metadata: ArgumentMetadata): T {
    return create(value, this._struct);
  }
}
