import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoresModule } from './producers/producers.module';
const settings = require('../ormconfig.js');
@Module({
  imports: [
    TypeOrmModule.forRoot(settings),
    ProdutoresModule,
  ],
})
export class AppModule {}
