import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async getAllProducers(): Promise<Producer[]> {
    return await this.producersRepository.find({ relations: ['cultures'] });
  }

  async getProducerById(id: number): Promise<Producer> {
    const producer = await this.producersRepository.findOneBy({ id: id })
    if (!producer) {
      throw new NotFoundException('Producer not found');
    }
    return producer;
  }

  async updateProducer(id: number, updatedProducer: Producer): Promise<Producer> {
    const existingProducer = await this.producersRepository.findOneBy({ id: id });

    if (!existingProducer) {
      throw new NotFoundException('Producer not found');
    }

    Object.assign(existingProducer, updatedProducer);

    return await this.producersRepository.save(existingProducer);
  }

  async removeProducer(id: number): Promise<Producer> {
    const producer = await this.producersRepository.findOneBy({ id: id });

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    await this.producersRepository.remove(producer);
    return producer;
  }

  async getTotalFarms(): Promise<number> {
    return this.producersRepository.count();
  }


  async getTotalArea(): Promise<number> {
    const totalArea = await this.producersRepository
      .createQueryBuilder('producer')
      .select('SUM(producer."totalArea")', 'totalArea')
      .getRawOne();
    return totalArea.totalArea;
  }

  async getStatePieChartData(): Promise<{ state: string; count: number }[]> {
    return this.producersRepository
      .createQueryBuilder('producer')
      .select('state, COUNT(*) as count')
      .groupBy('state')
      .getRawMany();
  }

  async getCulturePieChartData(): Promise<{ culture: string; count: number }[]> {
    return this.producersRepository
      .createQueryBuilder('producer')
      .innerJoinAndSelect('producer.cultures', 'culture')
      .select('culture.name as culture, COUNT(*) as count')
      .groupBy('culture.name')
      .getRawMany();
  }

  async getLandUsePieChartData(): Promise<{ category: string; area: number }[]> {
    const results = await this.producersRepository
      .createQueryBuilder('producer')
      .select([
        'SUM(producer."cultivableArea") as cultivableArea',
        'SUM(producer."vegetationArea") as vegetationArea',
      ])
      .getRawOne();
  
    return [
      { category: 'Cultivable Area', area: results.cultivableArea || 0 },
      { category: 'Vegetation Area', area: results.vegetationArea || 0 },
    ];
  }
  
  
  
  

}
