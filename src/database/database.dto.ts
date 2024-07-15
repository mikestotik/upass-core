import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


export abstract class DBEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated?: Date;
}


export class DBEntityDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created?: Date;

  @ApiProperty()
  updated?: Date;
}