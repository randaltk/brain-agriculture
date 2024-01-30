import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './producer.entity';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producersRepository: Repository<Producer>,
  ) { }

  private validateCPFAndCNPJ(value: string): boolean {
    return cpf.isValid(value) || cnpj.isValid(value);
  }

  async createProducer(producer: Producer): Promise<Producer> {
    if (!this.validateCPFAndCNPJ(producer.cpfCnpj)) {
      throw new BadRequestException('Invalid CPF or CNPJ');
    }

    return await this.producersRepository.save(producer);
  }
}
