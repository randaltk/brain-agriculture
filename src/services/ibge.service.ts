import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class IBGEService {
  constructor(private httpService: HttpService) {}

  getStates() {
    return this.httpService
      .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .pipe(map((response: AxiosResponse<any[]>) => response.data.map(state => state.sigla)));
  }

  getCitiesByState(state: string) {
    return this.httpService
      .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
      .pipe(map((response: AxiosResponse<any[]>) => response.data.map(city => city.nome)));
  }
}
