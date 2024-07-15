import { Column, Entity, ManyToOne } from 'typeorm';
import { PushSubscription } from 'web-push';
import { DBEntity } from '../../database/database.dto';
import { UserEntity } from './user.entity';
import { Integration, IntegrationTarget } from '../core/settings/settings.dto';


@Entity('settings')
export class SettingsEntity extends DBEntity {

  @Column({ nullable: true })
  pushEnabled?: boolean;

  @Column({ nullable: true, type: 'json' })
  pushSubscription?: PushSubscription;

  @Column({ nullable: true, type: 'int', array: true })
  favorites?: number[];

  @Column({ nullable: true, type: 'jsonb', default: [] })
  integrations?: Integration[];

  @ManyToOne(() => UserEntity, { eager: false, onDelete: 'CASCADE' })
  owner!: UserEntity;


  public hasIntegration(target: IntegrationTarget) {
    return this.integrations?.some(i => i.target === target && i.integrated);
  }

}
