import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RentModule } from './modules/rent.module';
import { PostgresModule } from 'nest-postgres';

@Module({
  imports: [
    PostgresModule.forRootAsync({
      useFactory: () => ({
        connectionString:
          'postgresql://postgres:password@localhost:5432/postgres',
      }),
    }),
    RentModule,
  ],
  providers: [AppService],
})
export class AppModule {}
