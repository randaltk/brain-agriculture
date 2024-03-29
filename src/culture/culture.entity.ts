import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producer } from '../producers/producer.entity';

@Entity()
export class Culture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Producer, producer => producer.cultures,{ onDelete: 'CASCADE' })
    producer: Producer;
}
