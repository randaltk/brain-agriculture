import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProducersService } from './producers.service';
import { Producer } from './producer.entity';
import { Repository } from 'typeorm';
import { ProducerValidationService } from './producer-validation/producer-validation.service';
import { ProducerChartService } from './producer-chart/producer-chart.service';
import { BadRequestException } from '@nestjs/common';

describe('ProducersService', () => {
    let service: ProducersService;
    let producerRepository: Repository<Producer>;
    let validationService: ProducerValidationService;
    let chartService: ProducerChartService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProducersService,
                ProducerValidationService,
                ProducerChartService,
                {
                    provide: getRepositoryToken(Producer),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ProducersService>(ProducersService);
        producerRepository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
        validationService = module.get<ProducerValidationService>(ProducerValidationService);
        chartService = module.get<ProducerChartService>(ProducerChartService);
    });

    describe('createProducer', () => {
        it('should create a producer', async () => {
            const mockProducer = {
                id: 1,
                cpfCnpj: '73992961036',
                name: 'John Doe',
                farmName: 'Farm',
                city: 'City',
                state: 'State',
                totalArea: 1000,
                cultivableArea: 500,
                vegetationArea: 200,
                cultures: [],
            } as Producer;

            jest.spyOn(producerRepository, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(validationService, 'validateProducerCreation').mockImplementation(); // Mock the validation method
            jest.spyOn(producerRepository, 'save').mockResolvedValueOnce(mockProducer);

            const result = await service.createProducer(mockProducer);

            expect(result).toEqual(mockProducer);
            expect(producerRepository.findOne).toHaveBeenCalledWith({ where: { cpfCnpj: mockProducer.cpfCnpj } });
            expect(validationService.validateProducerCreation).toHaveBeenCalledWith(mockProducer);
            expect(producerRepository.save).toHaveBeenCalledWith(mockProducer);
        });
        it('should create a producer', async () => {
            const mockProducer = {
                id: 1,
                cpfCnpj: '73992961036',
                name: 'John Doe',
                farmName: 'Farm',
                city: 'City',
                state: 'State',
                totalArea: 1000,
                cultivableArea: 500,
                vegetationArea: 200,
                cultures: [],
            } as Producer;

            jest.spyOn(producerRepository, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(validationService, 'validateProducerCreation').mockImplementation(); // Mock the validation method
            jest.spyOn(producerRepository, 'save').mockResolvedValueOnce(mockProducer);

            const result = await service.createProducer(mockProducer);

            expect(result).toEqual(mockProducer);
            expect(producerRepository.findOne).toHaveBeenCalledWith({ where: { cpfCnpj: mockProducer.cpfCnpj } });
            expect(validationService.validateProducerCreation).toHaveBeenCalledWith(mockProducer);
            expect(producerRepository.save).toHaveBeenCalledWith(mockProducer);
        });

        it('should throw BadRequestException if producer with same CPF/CNPJ already exists', async () => {
            const mockProducer = {
                id: 1,
                cpfCnpj: '12345678901',
                name: 'John Doe',
                farmName: 'Farm',
                city: 'City',
                state: 'State',
                totalArea: 1000,
                cultivableArea: 500,
                vegetationArea: 200,
                cultures: [],
            } as Producer;

            jest.spyOn(producerRepository, 'findOne').mockResolvedValueOnce(mockProducer);
            const validateProducerCreationSpy = jest.spyOn(validationService, 'validateProducerCreation');

            await expect(async () => await service.createProducer(mockProducer)).rejects.toThrow(BadRequestException);

            expect(producerRepository.findOne).toHaveBeenCalledWith({ where: { cpfCnpj: mockProducer.cpfCnpj } });
            expect(validateProducerCreationSpy).not.toHaveBeenCalled(); // Ensure validation is not called in this case
        });


    });
});
