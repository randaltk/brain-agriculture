import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { Producer } from './producer.entity';
import { ProducersService } from './producers.service';
import { IBGEService } from '../ibge-service/ibge.service';
import { firstValueFrom } from 'rxjs';

@Controller('producers')
export class ProducersController {
  constructor(
    private readonly producersService: ProducersService,
    private readonly ibgeService: IBGEService,
  ) {}

  @Get('states')
  async getStates(): Promise<string[]> {
    return await this.ibgeService.getStates().toPromise();
  }

  @Get('cities/:state')
  async getCities(@Param('state') state: string): Promise<string[]> {
    const citiesObservable = this.ibgeService.getCitiesByState(state);
    return await firstValueFrom(citiesObservable);
  }
  
  @Get(':id')
  async getProducerById(@Param('id') id: number): Promise<Producer> {
    const producer = await this.producersService.getProducerById(id);

    if (!producer) {
      throw new HttpException('Producer not found', HttpStatus.NOT_FOUND);
    }

    return producer;
  }

  @Post()
  async createProducer(@Body() producer: Producer): Promise<Producer> {
    return await this.producersService.createProducer(producer);
  }

  @Get()
  async getAllProducers(): Promise<Producer[]> {
    return await this.producersService.getAllProducers();
  }

  @Put(':id')
  async updateProducer(@Param('id') id: number, @Body() updatedProducer: Producer): Promise<Producer> {
    return await this.producersService.updateProducer(id, updatedProducer);
  }

  @Delete(':id')
  async deleteProducer(@Param('id') id: number): Promise<string> {
    const deletedProducer = await this.producersService.removeProducer(id);

    if (!deletedProducer) {
      throw new HttpException('Producer not found', HttpStatus.NOT_FOUND);
    }

    return `Producer with id ${id} has been successfully deleted.`;
  }

  @Get('dashboard/total-farms')
  async getTotalFarms(): Promise<{ totalFarms: number; totalArea: number }> {
    const totalFarms = await this.producersService.getTotalFarms();
    const totalArea = await this.producersService.getTotalArea();
    return { totalFarms, totalArea };
  }

  @Get('dashboard/state-pie-chart')
  async getStatePieChart(): Promise<{ state: string; count: number }[]> {
    return this.producersService.getStatePieChartData();
  }

  @Get('dashboard/culture-pie-chart')
  async getCulturePieChart(): Promise<{ culture: string; count: number }[]> {
    return this.producersService.getCulturePieChartData();
  }

  @Get('dashboard/land-use-pie-chart')
  async getLandUsePieChartData(): Promise<{ category: string; area: number }[]> {
    return await this.producersService.getLandUsePieChartData();
  }

}
