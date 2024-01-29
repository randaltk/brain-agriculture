import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './producer.entity';
import { ProducersModule } from './producers.module';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producersRepository: Repository<Producer>,
  ) {}

  async createProducer(producer: Producer): Promise<Producer> {
    return await this.producersRepository.save(producer);
  }

 
}
