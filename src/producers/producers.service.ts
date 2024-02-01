import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './producer.entity';
import { ProducerValidationService } from './producer-validation/producer-validation.service';
import { ProducerChartService } from './producer-chart/producer-chart.service';


@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producersRepository: Repository<Producer>,
    private readonly validationService: ProducerValidationService,
    private readonly chartService: ProducerChartService,
  ) { }


  async createProducer(producer: Producer): Promise<Producer> {
    const existingProducer = await this.producersRepository.findOne({ where: { cpfCnpj: producer.cpfCnpj } });

    if (existingProducer) {
      throw new BadRequestException('CPF/CNPJ already registered');
    }

    this.validationService.validateProducerCreation(producer);

    return await this.producersRepository.save(producer);
  }


  async getAllProducers(): Promise<Producer[]> {
    return await this.producersRepository.find({ relations: ['cultures'] });
  }

  async getProducerById(id: number): Promise<Producer> {
    const producer = await this.producersRepository.findOne({
      where: { id },
      relations: ['cultures'],
    });
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
    this.validationService.validateProducerCreation(existingProducer);
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
    return this.chartService.getTotalFarms()
  }

  async getTotalArea(): Promise<number> {
    return this.chartService.getTotalArea();
  }

  async getStatePieChartData(): Promise<{ state: string; count: number }[]> {
    return this.chartService.getStatePieChartData();
  }

  async getCulturePieChartData(): Promise<{ culture: string; count: number }[]> {
    return this.chartService.getCulturePieChartData();
  }

  async getLandUsePieChartData(): Promise<{ category: string; area: number }[]> {
    return this.chartService.getLandUsePieChartData();
  }

}
