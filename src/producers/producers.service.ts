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
    const existingProducer = await this.producersRepository.findOne({ where: { cpfCnpj: producer.cpfCnpj } });
    
    if (existingProducer) {
      throw new BadRequestException('CPF/CNPJ already registered');
    }

    if (!this.validateCPFAndCNPJ(producer.cpfCnpj)) {
      throw new BadRequestException('Invalid CPF or CNPJ');
    }
  
    const precision = 2; 

    const roundedCultivable = Math.round(producer.cultivableArea * 10 ** precision) / 10 ** precision;
    const roundedVegetation = Math.round(producer.vegetationArea * 10 ** precision) / 10 ** precision;
    const roundedTotal = Math.round(producer.totalArea * 10 ** precision) / 10 ** precision;
    
    if (roundedCultivable + roundedVegetation > roundedTotal) {
      throw new BadRequestException('Sum of cultivableArea and vegetationArea cannot be greater than totalArea');
    }
  
    return await this.producersRepository.save(producer);
  }
}
