import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { IBGEService } from '../ibge-service/ibge.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Producer } from './producer.entity';


jest.mock('./producers.service');

describe('ProducersController', () => {
    let controller: ProducersController;
    let producersService: ProducersService;
    let ibgeService: IBGEService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProducersController],
            providers: [
                ProducersService,
                IBGEService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(() => of({ data: [] })),
                    },
                },
            ],
        }).compile();

        controller = module.get<ProducersController>(ProducersController);
        producersService = module.get<ProducersService>(ProducersService);
        ibgeService = module.get<IBGEService>(IBGEService);
    });

    describe('getStates', () => {
        it('should return an array of states', async () => {
            const states = ['State1', 'State2'];
            jest.spyOn(ibgeService, 'getStates').mockReturnValue(of(states));

            const result = await controller.getStates();

            expect(result).toEqual(states);
        });
    });
    describe('getCities', () => {
        it('should return an array of cities for a given state', async () => {
            const state = 'State1';
            const cities = ['City1', 'City2'];
            jest.spyOn(ibgeService, 'getCitiesByState').mockReturnValue(of(cities));

            const result = await controller.getCities(state);

            expect(result).toEqual(cities);
        });
    });
    describe('getProducerById', () => {
        it('should return a producer by ID', async () => {
            const newProducer: Producer = {
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
            };

            jest.spyOn(producersService, 'getProducerById').mockResolvedValue(newProducer);

            const result = await controller.getProducerById(1);

            expect(result).toEqual(newProducer);
        });

        it('should throw an HttpException if producer is not found', async () => {
            jest.spyOn(producersService, 'getProducerById').mockResolvedValue(null);
        
            await expect(async () => {
                await controller.getProducerById(1);
            }).rejects.toThrow(new HttpException('Producer not found', HttpStatus.NOT_FOUND));
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
});
