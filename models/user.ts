import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength
} from 'class-validator';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import BaseEntity from './base';
import Order from './order';

export enum Permissions {
  CUSTOMER = 'Customer',
  EMPLOYEE = 'Employee',
  OWNER = 'Owner'
}

@Entity({ name: 'users' })
@Unique(['email'])
export default class User extends BaseEntity {
  @IsNotEmpty()
  @Column('text', { nullable: false })
  firstname!: string;

  @IsNotEmpty()
  @Column('text', { nullable: false })
  lastname!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @Column('text', { nullable: false })
  email!: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Column('text', { nullable: false, select: false })
  password?: string;

  @IsNotEmpty()
  @IsEnum(Permissions)
  @Column({ type: 'enum', enum: Permissions })
  permissions!: Permissions;

  @OneToMany(() => Order, (order) => order.customer)
  orders!: Order[];
}
