import { Injectable, BadRequestException } from '@nestjs/common';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Producer } from '../producer.entity';

@Injectable()
export class ProducerValidationService {
  validateCPFAndCNPJ(value: string): boolean {
    return cpf.isValid(value) || cnpj.isValid(value);
  }

  validateProducerCreation(producer: Producer): void {
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
  }
}
