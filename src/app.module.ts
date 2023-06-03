import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RentController } from './controllers/rent.controller';
import { PostgresModule } from 'nest-postgres';
import { RentService } from './services/rent.service';
import { RentModule } from './modules/rent.module';

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
  controllers: [RentController],
  providers: [AppService, RentService],
})
export class AppModule {}
