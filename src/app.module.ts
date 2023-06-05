import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RentModule } from './modules/rent.module';
import { PostgresModule } from 'nest-postgres';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectionString: config.get<string>('DB_CONNECTION_STRING'),
      }),
    }),
    RentModule,
  ],
  providers: [AppService],
})
export class AppModule {}
