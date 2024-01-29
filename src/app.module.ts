import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersModule } from './producers/producers.module';
const settings = require('../ormconfig.js');
@Module({
  imports: [
    TypeOrmModule.forRoot(settings),
    ProducersModule,
  ],
})
export class AppModule {}
