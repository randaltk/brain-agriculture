import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './producer.entity';


describe('Producer Entity', () => {
  let producerRepository: Repository<Producer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Producer),
          useClass: Repository,
        },
      ],
    }).compile();

    producerRepository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  it('should be defined', () => {
    expect(producerRepository).toBeDefined();
  });

  describe('Create Producer', () => {
    it('should create a new producer', async () => {
     
      const mockSave = jest.fn().mockResolvedValue({
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
      });

      producerRepository.save = mockSave;

      const newProducer: Producer = {
        id:2,
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

      const createdProducer = await producerRepository.save(newProducer);

      expect(createdProducer.id).toBeDefined();
      expect(createdProducer.cpfCnpj).toEqual(newProducer.cpfCnpj);
      expect(mockSave).toHaveBeenCalledWith(newProducer);
    });
  });


});
