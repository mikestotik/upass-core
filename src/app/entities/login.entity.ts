import { Column, Entity, ManyToOne } from 'typeorm';
import { DBEntity } from '../../database/database.dto';
import { UserEntity } from './user.entity';

@Entity('logins')
export class LoginEntity extends DBEntity {
  @Column()
  title!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  totp?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  favorite?: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  owner!: UserEntity;
}
