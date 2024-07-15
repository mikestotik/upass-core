import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { SettingsEntity } from '../../entities/settings.entity';
import { CreateSettingsDTO, UpdateSettingDTO } from './settings.dto';


@Injectable()
export class SettingsService {


  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>) {
  }


  public findById(id: number): Promise<SettingsEntity | null> {
    return this.settingsRepository.findOneBy({ id });
  }


  public async findByUserId(ownerId: number): Promise<SettingsEntity | null> {
    const entity = await this.settingsRepository.findOneBy({ owner: { id: ownerId } });
    if (!entity) {
      return this.create({}, ownerId);
    } else {
      return entity;
    }
  }


  public create(dto: CreateSettingsDTO, ownerId: number): Promise<SettingsEntity> {
    return this.settingsRepository.save(
      plainToInstance(SettingsEntity, { ...dto, owner: { id: ownerId } }),
    );
  }


  public async updateByOwner(ownerId: number, dto: UpdateSettingDTO) {
    const settings = await this.findByUserId(ownerId);

    if (!settings) {
      throw new NotFoundException('No settings for this user');
    }
    return this.settingsRepository.update(settings.id, dto)
      .then(() => this.findById(settings.id));
  }
}
