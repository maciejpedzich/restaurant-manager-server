import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

export default abstract class BaseModel {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	dateCreated!: Date;

	@UpdateDateColumn()
	dateUpdated!: Date;
}
