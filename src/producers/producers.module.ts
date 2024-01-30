import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { Producer } from './producer.entity';
import { IBGEService } from '../ibge-service/ibge.service';
import { ProducerValidationService } from './producer-validation/producer-validation.service';
import { ProducerChartService } from './producer-chart/producer-chart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producer]), HttpModule.register({})],
  controllers: [ProducersController],
  providers: [
    ProducersService,
    IBGEService,
    ProducerValidationService,
    ProducerChartService,
  ],
  exports: [ProducersService],
})
export class ProducersModule { }
