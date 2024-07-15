import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SettingsService } from '../core/settings/settings.service';
import { UserCreatedEvent } from '../core/user/user.dto';


@Injectable()
export class UserListener {

  constructor(
    private readonly settingsService: SettingsService) {
  }


  @OnEvent('user.created')
  public async onUserCreated(event: UserCreatedEvent) {
    await this.settingsService.create({}, event.userId);
  }
}
