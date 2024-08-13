import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { DBEntity } from '../../database/database.dto';
import { UserStatus } from '../core/user/user.enum';
import { RoleEntity } from './role.entity';


@Entity('users')
export class UserEntity extends DBEntity {

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  fullName!: string;

  @Column()
  password!: string;

  @Column()
  masterPassword!: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ default: 'en', length: 2 })
  lang?: string;

  @Column({ nullable: true, type: 'enum', enum: UserStatus })
  status?: UserStatus;

  @Column({ nullable: true })
  refreshToken?: string;

  @JoinTable({ name: 'users_roles' })
  @ManyToMany(() => RoleEntity, { cascade: true, eager: true })
  roles!: RoleEntity[];

}
