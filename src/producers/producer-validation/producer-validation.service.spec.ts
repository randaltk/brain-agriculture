import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProducerValidationService } from './producer-validation.service';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Producer } from '../producer.entity';

jest.mock('cpf-cnpj-validator');

describe('ProducerValidationService', () => {
    let service: ProducerValidationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProducerValidationService],
        }).compile();

        service = module.get<ProducerValidationService>(ProducerValidationService);
    });

    describe('validateCPFAndCNPJ', () => {
        it('should return true for a valid CPF', () => {
            const isValidSpy = jest.spyOn(cpf, 'isValid').mockReturnValue(true);

            const result = service.validateCPFAndCNPJ('12345678909');

            expect(isValidSpy).toHaveBeenCalledWith('12345678909');
            expect(result).toBe(true);
        });
        it('should return true for a valid CNPJ', () => {
            const result = service.validateCPFAndCNPJ('56277148000122');

            expect(result).toBe(true);
            expect('56277148000122').toMatch(/^\d{14}$/); 
        });

        it('should return false for an invalid CPF or CNPJ', () => {
            jest.spyOn(cpf, 'isValid').mockReturnValue(false);
            jest.spyOn(cnpj, 'isValid').mockReturnValue(false);

            const result = service.validateCPFAndCNPJ('invalid_value');

            expect(result).toBe(false);
        });
    });

    describe('validateProducerCreation', () => {
        it('should not throw an exception for a valid producer', () => {
            jest.spyOn(service, 'validateCPFAndCNPJ').mockReturnValueOnce(true);

            const validProducer: Producer = {
                cpfCnpj: '12345678909',
                cultivableArea: 100,
                vegetationArea: 50,
                totalArea: 150,
                id: 0,
                name: '',
                farmName: '',
                city: '',
                state: '',
                cultures: []
            };

            expect(() => service.validateProducerCreation(validProducer)).not.toThrow();
        });

        it('should throw a BadRequestException for an invalid CPF or CNPJ', () => {
            jest.spyOn(service, 'validateCPFAndCNPJ').mockReturnValueOnce(false);

            const invalidProducer: Producer = {
                cpfCnpj: 'invalid_value',
                cultivableArea: 100,
                vegetationArea: 50,
                totalArea: 150,
                id: 0,
                name: '',
                farmName: '',
                city: '',
                state: '',
                cultures: []
            };

            expect(() => service.validateProducerCreation(invalidProducer)).toThrow(BadRequestException);
        });

        it('should throw a BadRequestException for sum of cultivableArea and vegetationArea greater than totalArea', () => {
            jest.spyOn(service, 'validateCPFAndCNPJ').mockReturnValueOnce(true);

            const invalidProducer: Producer = {
                cpfCnpj: '12345678909',
                cultivableArea: 100,
                vegetationArea: 70,
                totalArea: 150,
                id: 0,
                name: '',
                farmName: '',
                city: '',
                state: '',
                cultures: []
            };

            expect(() => service.validateProducerCreation(invalidProducer)).toThrow(BadRequestException);
        });
    });
});
