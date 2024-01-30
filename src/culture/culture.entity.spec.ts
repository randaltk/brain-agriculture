import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Culture } from './culture.entity';

describe('Culture Entity', () => {
    let cultureRepository: Repository<Culture>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(Culture),
                    useClass: Repository,
                },
            ],
        }).compile();

        cultureRepository = module.get<Repository<Culture>>(getRepositoryToken(Culture));
    });

    it('should be defined', () => {
        expect(cultureRepository).toBeDefined();
    });

    describe('Create Culture', () => {
        it('should create a new culture', async () => {
            // Mock the save method of the repository
            const mockSave = jest.fn().mockResolvedValue({
                id: 1,
                name: 'Soybean',
                producer: {
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
                },
            });

            cultureRepository.save = mockSave;

            const newCulture: Culture = {
                id: 1,
                name: 'Soybean',
                producer: {
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
                },
            };

            const createdCulture = await cultureRepository.save(newCulture);

            expect(createdCulture.id).toBeDefined();
            expect(createdCulture.name).toEqual(newCulture.name);

            expect(mockSave).toHaveBeenCalledWith(newCulture);
        });
    });

});
