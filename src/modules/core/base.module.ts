import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
  ],
})
export class BaseModule {}
