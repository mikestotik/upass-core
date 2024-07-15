import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TokenPayload } from '../../decor/token.decorator';
import { JwtPayload } from '../../interfaces/jwt.interface';

import { AccessTokenGuard } from '../auth/guards/token.guard';
import { SettingsDTO, UpdateSettingDTO } from './settings.dto';
import { SettingsService } from './settings.service';


@UseGuards(AccessTokenGuard)
@Controller('settings')
export class SettingsController {

  constructor(
    private readonly settingsService: SettingsService) {
  }


  @Get()
  public async find(@TokenPayload() payload: JwtPayload) {
    return this.settingsService.findByUserId(payload.sub)
      .then(value => plainToInstance(SettingsDTO, value));
  }


  @Patch()
  public async update(@Body() dto: UpdateSettingDTO, @TokenPayload() payload: JwtPayload) {
    return this.settingsService.updateByOwner(payload.sub, dto)
      .then(value => plainToInstance(SettingsDTO, value));
  }

}
