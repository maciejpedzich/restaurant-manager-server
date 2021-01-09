import { Column, Entity, OneToMany, Unique } from 'typeorm';
import BaseEntity from './base';
import { Order } from './order';

export enum Permissions {
	CUSTOMER = 'customer',
	OWNER = 'owner'
}

@Entity({ name: 'users' })
@Unique(['email'])
export default class User extends BaseEntity {
	@Column('text', { nullable: false })
	firstname!: string;

	@Column('text', { nullable: false })
	email!: string;

	@Column('text', { nullable: false, select: false })
	password?: string;

	@Column({ type: 'enum', enum: Permissions, default: Permissions.CUSTOMER })
	permissions!: Permissions;

	@OneToMany(() => Order, (order) => order.customer, { cascade: true })
	orders!: Order[];
}
