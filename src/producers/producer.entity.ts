import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Produtor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cpfCnpj: string;

  @Column()
  nome: string;

  @Column()
  nomeFazenda: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column({ type: 'float' })
  areaTotal: number;

  @Column({ type: 'float' })
  areaAgricultavel: number;

  @Column({ type: 'float' })
  areaVegetacao: number;
}

