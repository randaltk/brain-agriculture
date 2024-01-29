import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produtor } from './producer.entity';

@Injectable()
export class ProdutoresService {
  constructor(
    @InjectRepository(Produtor)
    private readonly produtoresRepository: Repository<Produtor>,
  ) {}

  async criarProdutor(produtor: Produtor): Promise<Produtor> {
    return await this.produtoresRepository.save(produtor);
  }

 
}
