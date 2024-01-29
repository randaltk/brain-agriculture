import { Body, Controller, Post } from '@nestjs/common';
import { Produtor } from './producer.entity';
import { ProdutoresService } from './producers.service';

@Controller('producers')
export class ProdutoresController {
  constructor(private readonly produtoresService: ProdutoresService) {}

  @Post()
  async criarProdutor(@Body() produtor: Produtor): Promise<Produtor> {
    return await this.produtoresService.criarProdutor(produtor);
  }

}
