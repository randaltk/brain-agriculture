import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Culture } from '../culture/culture.entity';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cpfCnpj: string;

  @Column()
  name: string;

  @Column()
  farmName: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ type: 'float'})
  totalArea: number;

  @Column({ type: 'float' })
  cultivableArea: number;

  @Column({ type: 'float' })
  vegetationArea: number;

  @OneToMany(() => Culture, culture => culture.producer,{ cascade: true })
  cultures: Culture[];
}
