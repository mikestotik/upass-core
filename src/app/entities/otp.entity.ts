import { Column, Entity, ManyToOne } from 'typeorm';
import { DBEntity } from '../../database/database.dto';
import { UserEntity } from './user.entity';
import { OtpType } from '../core/otp/otp.enum';


@Entity('otp')
export class OtpEntity<T = object> extends DBEntity {
  @Column()
  code!: number;

  @Column({ type: 'enum', enum: OtpType, nullable: true })
  type!: OtpType;

  @Column({ type: 'timestamptz' })
  exp!: Date;

  @Column({ type: 'json', nullable: true })
  data?: T;

  @ManyToOne(() => UserEntity, { eager: true, onDelete: 'CASCADE' })
  owner!: UserEntity;
}
