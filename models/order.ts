import { Entity, Column, ManyToOne } from 'typeorm';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateIf
} from 'class-validator';

import BaseEntity from './base';
import User from './user';
import OrderProduct from '../interfaces/order-product';

export enum CollectionMethod {
  DELIVERY = 'Delivery',
  TAKEAWAY = 'Takeaway'
}

export enum Status {
  RECEIVED = 'Received',
  PREPARING = 'Preparing',
  PACKING = 'Packing',
  DELIVERING = 'Delivering',
  READY = 'Ready'
}

@Entity({ name: 'orders' })
export default class Order extends BaseEntity {
  @Column({ type: 'enum', enum: Status, default: Status.RECEIVED })
  status!: Status;

  @IsDefined()
  @IsArray()
  @Column('json', { nullable: false })
  content!: OrderProduct[];

  @IsDefined()
  @IsNumber()
  @Column('decimal', { nullable: false, precision: 5, scale: 2 })
  cost!: number;

  @IsDefined()
  @IsEnum(CollectionMethod)
  @Column({ type: 'enum', enum: CollectionMethod })
  collectionMethod!: CollectionMethod;

  @ValidateIf((o) => o.collectionMethod === CollectionMethod.DELIVERY)
  @IsNotEmpty()
  @Column('text')
  street!: string;

  @ValidateIf((o) => o.collectionMethod === CollectionMethod.DELIVERY)
  @IsNumber()
  @Column('int')
  number!: number;

  @ValidateIf((o) => o.collectionMethod === CollectionMethod.DELIVERY)
  @IsNumber()
  @Column('int')
  flatNumber!: number;

  @ManyToOne(() => User, (user) => user.orders, { cascade: true })
  customer!: User;
}
