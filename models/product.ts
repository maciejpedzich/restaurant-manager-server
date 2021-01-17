import { Entity, Column } from 'typeorm';
import { IsDefined, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import BaseEntity from '../models/base';

export enum Availability {
  IN_STOCK = 'In stock',
  LOW_STOCK = 'Low stock',
  OUT_OF_STOCK = 'Out of stock'
}

@Entity({ name: 'products' })
export default class Product extends BaseEntity {
  @IsDefined()
  @IsNotEmpty()
  @Column('text', { nullable: false })
  name!: string;

  @IsDefined()
  @IsNumber()
  @Column('decimal', { nullable: false, precision: 5, scale: 2 })
  price!: number;

  @IsDefined()
  @Column('text', { nullable: false })
  imageUrl!: string;

  @IsDefined()
  @IsNotEmpty()
  @Column('text', { nullable: false })
  category!: string;

  @IsDefined()
  @IsEnum(Availability)
  @Column({ type: 'enum', enum: Availability })
  availability!: Availability;
}
