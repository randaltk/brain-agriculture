import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
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

  @Get()
  async getAllProducers(): Promise<Producer[]> {
    return await this.producersService.getAllProducers();
  }

  @Get(':id')
  async getProducerById(@Param('id') id: number): Promise<Producer> {
    const producer = await this.producersService.getProducerById(id);

    if (!producer) {
      throw new HttpException('Producer not found', HttpStatus.NOT_FOUND);
    }

    return producer;
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


  @Get('states')
  async getStates(): Promise<string[]> {
    return await firstValueFrom(this.ibgeService.getStates());
  }

  @Get('cities/:state')
  async getCities(@Param('state') state: string): Promise<string[]> {
    return await firstValueFrom(this.ibgeService.getCitiesByState(state));
  }
}
