import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProducerChartService } from './producer-chart.service';
import { Producer } from '../producer.entity';

class MockProducerRepository extends Repository<Producer> {}

describe('ProducerChartService', () => {
  let service: ProducerChartService;
  let producerRepository: MockProducerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerChartService,
        {
          provide: getRepositoryToken(Producer),
          useClass: MockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<ProducerChartService>(ProducerChartService);
    producerRepository = module.get<MockProducerRepository>(
      getRepositoryToken(Producer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTotalFarms', () => {
    it('should return the total number of farms', async () => {
      jest
        .spyOn(producerRepository, 'count')
        .mockReturnValueOnce(Promise.resolve(10));

      const result = await service.getTotalFarms();

      expect(result).toBe(10);
    });
  });

  describe('getTotalArea', () => {
    it('should return the total area', async () => {
      jest.spyOn(producerRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockReturnValueOnce({ totalArea: 1000 }),
      } as any);

      const result = await service.getTotalArea();

      expect(result).toBe(1000);
    });
  });

  describe('getStatePieChartData', () => {
    it('should return state pie chart data', async () => {
      jest.spyOn(producerRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValueOnce([
          { state: 'CA', count: 5 },
          { state: 'NY', count: 3 },
        ]),
      } as any);

      const result = await service.getStatePieChartData();

      expect(result).toEqual([
        { state: 'CA', count: 5 },
        { state: 'NY', count: 3 },
      ]);
    });
  });

  describe('getCulturePieChartData', () => {
    it('should return culture pie chart data', async () => {
      jest.spyOn(producerRepository, 'createQueryBuilder').mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValueOnce([
          { culture: 'Wheat', count: 8 },
          { culture: 'Corn', count: 2 },
        ]),
      } as any);

      const result = await service.getCulturePieChartData();

      expect(result).toEqual([
        { culture: 'Wheat', count: 8 },
        { culture: 'Corn', count: 2 },
      ]);
    });
  });
  describe('getLandUsePieChartData', () => {
    it('should return land use pie chart data', async () => {
      
      jest.spyOn(producerRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockReturnValueOnce([{ category: 'Cultivable Area', area: 500 }]),
      } as any);

      jest.spyOn(producerRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockReturnValueOnce([{ category: 'Vegetation Area', area: 200 }]),
      } as any);

      const result = await service.getLandUsePieChartData();

      expect(result).toEqual([
        { category: 'Cultivable Area', area: 500 },
        { category: 'Vegetation Area', area: 200 },
      ]);

      expect(producerRepository.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(producerRepository.createQueryBuilder).toHaveBeenCalledWith(
        'producer',
      );
      expect(producerRepository.createQueryBuilder).toHaveBeenCalledWith(
        'producer',
      );
    });
  });
});
