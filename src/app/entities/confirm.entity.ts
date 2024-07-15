import { Column, Entity, ManyToOne } from 'typeorm';
import { DBEntity } from '../../database/database.dto';
import { UserEntity } from './user.entity';
import { ConfirmType } from '../core/confirm/confirm.enum';


@Entity('confirmations')
export class ConfirmEntity<T = object> extends DBEntity {
  @Column()
  code!: number;

  @Column({ type: 'enum', enum: ConfirmType, nullable: true })
  type!: ConfirmType;

  @Column({ type: 'timestamptz' })
  exp!: Date;

  @Column({ type: 'json', nullable: true })
  data?: T;

  @ManyToOne(() => UserEntity, { eager: true, onDelete: 'CASCADE' })
  owner!: UserEntity;
}
