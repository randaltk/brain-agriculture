import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producer } from '../producer.entity';

@Injectable()
export class ProducerChartService {
  constructor(
    @InjectRepository(Producer)
    private readonly producersRepository: Repository<Producer>,
  ) {}
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
