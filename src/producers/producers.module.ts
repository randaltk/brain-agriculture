import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; 
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { Producer } from './producer.entity';
import { IBGEService } from '../services/ibge.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producer]), HttpModule.register({})], 
  controllers: [ProducersController],
  providers: [ProducersService, IBGEService],
})
export class ProducersModule {}
