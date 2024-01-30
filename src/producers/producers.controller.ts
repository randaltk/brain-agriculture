import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Producer } from './producer.entity';
import { ProducersService } from './producers.service';
import { IBGEService } from '../services/ibge.service';
import { firstValueFrom } from 'rxjs';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService, private readonly ibgeService: IBGEService) { }

  @Post()
  async createProducer(@Body() producer: Producer): Promise<Producer> {
    return await this.producersService.createProducer(producer);
  }

  @Get('states')
  async getStates(): Promise<string[]> {
    return await firstValueFrom(this.ibgeService.getStates());
  }

  @Get('cities/:state')
  async getCities(@Param('state') state: string): Promise<string[]> {
    return await firstValueFrom(this.ibgeService.getCitiesByState(state));
  }
}
