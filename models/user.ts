import { Column, Entity, Unique } from 'typeorm';
import BaseModel from './base';

@Entity({ name: 'users' })
@Unique(['email'])
export default class User extends BaseModel {
	@Column('text', { nullable: false })
	firstname!: string;

	@Column('text', { nullable: false })
	lastname!: string;

	@Column('text', { nullable: false })
	email!: string;

	@Column('text', { nullable: false, select: false })
	password?: string;

	@Column('text', { nullable: false })
	location!: string;

	@Column('text', { nullable: false, array: true })
	favouriteCategories!: string[];
}
