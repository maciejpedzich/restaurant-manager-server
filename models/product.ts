import { Entity, Column } from 'typeorm';
import BaseEntity from '../models/base';

export enum Availability {
	IN_STOCK = 'In stock',
	LOW_STOCK = 'Low stock',
	OUT_OF_STOCK = 'Out of stock'
}

@Entity({ name: 'products' })
export default class Product extends BaseEntity {
	@Column('text', { nullable: false })
	name!: string;

	@Column('decimal', { nullable: false, precision: 5, scale: 2 })
	price!: number;

	@Column('text', { nullable: false })
	imageUrl!: string;

	@Column('text', { nullable: false })
	category!: string;

	//prettier-ignore
	@Column({
		type: 'enum',
		enum: Availability,
		default: Availability.IN_STOCK
	})
	availability!: Availability;
}
