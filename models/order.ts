import { Entity, Column, ManyToOne } from 'typeorm';

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

	@Column('json', { nullable: false })
	content!: OrderProduct[];

	@ManyToOne(() => User, (user) => user.orders)
	customer!: User;
}
