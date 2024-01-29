import { Body, Controller, Post } from '@nestjs/common';
import { Producer } from './producer.entity';
import { ProducersService } from './producers.service';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  async createProducer(@Body() producer: Producer): Promise<Producer> {
    return await this.producersService.createProducer(producer);
  }

}
