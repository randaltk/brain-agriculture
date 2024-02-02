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

  async getCulturePieChartData(): Promise<
    { culture: string; count: number }[]
  > {
    return this.producersRepository
      .createQueryBuilder('producer')
      .innerJoinAndSelect('producer.cultures', 'culture')
      .select('culture.name as culture, COUNT(*) as count')
      .groupBy('culture.name')
      .getRawMany();
  }
  async getLandUsePieChartData(): Promise<
    { category: string; area: number }[]
  > {
    const result = await this.producersRepository
      .createQueryBuilder('producer')
      .select([
        "CASE WHEN producer.cultivableArea > 0 THEN 'Cultivable Area' ELSE 'Vegetation Area' END as category",
        'SUM(producer.cultivableArea) as area',
      ])
      .groupBy('category')
      .getRawMany();

    const resultVegetation = await this.producersRepository
      .createQueryBuilder('producer')
      .select([
        "CASE WHEN producer.vegetationArea > 0 THEN 'Vegetation Area' ELSE 'Cultivable Area' END as category",
        'SUM(producer.vegetationArea) as area',
      ])
      .groupBy('category')
      .getRawMany();

    const combinedResult = [...result, ...resultVegetation];

    return combinedResult.map((item) => ({
      category: item.category,
      area: parseFloat(item.area) || 0,
    }));
  }
}
