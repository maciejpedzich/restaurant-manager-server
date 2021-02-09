import { Entity, Column, ManyToOne } from 'typeorm';
import { IsArray, IsDefined, IsNumber } from 'class-validator';

import BaseEntity from './base';
import User from './user';
import OrderProduct from '../interfaces/order-product';

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

  @ManyToOne(() => User, (user) => user.orders, { cascade: true })
  customer!: User;
}
