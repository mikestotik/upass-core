import { PartialType } from '@nestjs/mapped-types';
import { PushSubscription } from 'web-push';
import { DBEntityDTO } from '../../../database/database.dto';


export enum IntegrationTarget {
  Patreon
}


export interface PatreonIntegrationData {
  userId: string;
  email: string;
}


export interface Integration<DataType = object> {
  target: IntegrationTarget;
  integrated: boolean;
  data: DataType; // PatreonIntegrationData
}


export class CreateSettingsDTO {
  pushEnabled?: boolean;
  pushSubscription?: PushSubscription;
  favorites?: number[];
  integrations?: Integration[];
}


export class UpdateSettingDTO extends PartialType(CreateSettingsDTO) {
}


export class SettingsDTO extends DBEntityDTO {
  pushEnabled!: boolean;
  pushSubscription!: PushSubscription;
  favorites!: number[];
  integrations?: Integration[];
}
