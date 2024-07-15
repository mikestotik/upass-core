import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity('roles')
export class RoleEntity {

  @PrimaryColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;
}
