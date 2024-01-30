import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { IBGEService } from './ibge.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

describe('IBGEService', () => {
  let ibgeService: IBGEService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [IBGEService],
    }).compile();

    ibgeService = module.get<IBGEService>(IBGEService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(ibgeService).toBeDefined();
  });

  describe('getStates', () => {
    it('should return an array of state abbreviations', async () => {
      const mockData = [{ sigla: 'SP' }, { sigla: 'RJ' }];
      jest.spyOn(httpService, 'get').mockImplementation(() => of({ data: mockData } as AxiosResponse));

      const result = await firstValueFrom(ibgeService.getStates());

      expect(result).toEqual(['SP', 'RJ']);
    });
  });

  describe('getCitiesByState', () => {
    it('should return an array of city names for a given state', async () => {
      const state = 'SP';
      const mockData = [{ nome: 'Sao Paulo' }, { nome: 'Campinas' }];
      jest.spyOn(httpService, 'get').mockImplementation(() => of({ data: mockData } as AxiosResponse));

      const result = await firstValueFrom(ibgeService.getCitiesByState(state));

      expect(result).toEqual(['Sao Paulo', 'Campinas']);
    });
  });
});
