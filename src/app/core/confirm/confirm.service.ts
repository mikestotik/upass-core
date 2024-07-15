import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { RandomUtils } from '../../utils/random.utils';
import { UserEmailDTO } from '../user/user.dto';
import { UserStatus } from '../user/user.enum';
import { UserService } from '../user/user.service';
import { CreateConfirmDTO } from './confirm.dto';
import { ConfirmEntity } from '../../entities/confirm.entity';
import { ConfirmType } from './confirm.enum';
import { ConfirmUtils } from './confirm.utils';


@Injectable()
export class ConfirmService {


  constructor(
    @InjectRepository(ConfirmEntity)
    private readonly repository: Repository<ConfirmEntity>,
    private readonly userService: UserService) {
  }


  public findByOwner(ownerId: number) {
    return this.repository.find({ where: { owner: { id: ownerId } } });
  }


  public findByCode(code: number): Promise<ConfirmEntity | null> {
    return this.repository.findOneBy({ code });
  }


  public create(userId: number, dto: CreateConfirmDTO) {
    return this.repository.save(
      plainToInstance(ConfirmEntity, { ...dto, owner: { id: userId } })
    );
  }


  public async confirm(code: number) {
    const entity = await this.findByCode(code);

    ConfirmUtils.validate(entity);

    switch (entity!.type) {
      case ConfirmType.EmailConfirmation:
        return this.handleEmailConfirmation(entity as ConfirmEntity<UserEmailDTO>);
    }
  }


  private async handleEmailConfirmation({ data }: ConfirmEntity<UserEmailDTO>) {
    const user = await this.validateUserEmail(data!.email);
    await this.userService.update(user.id, {
      status: UserStatus.Activated
    });
  }


  public createEmailConfirmation(userId: number, email: string) {
    return this.create(userId, {
      code: RandomUtils.generateCode(),
      type: ConfirmType.EmailConfirmation,
      data: { email },
      exp: dayjs().add(3600, 'second').toDate()
    });
  }


  public async deleteByIdAndOwner(id: number, ownerId: number) {
    const entity = await this.repository.findOneBy({ id: id, owner: { id: ownerId } });
    if (!entity) {
      throw new BadRequestException('There is no record with this ID or you are not the owner.');
    }
    await this.repository.remove(entity);
  }


  private async validateUserEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('You are not registered. Register and try again.');
    }
    return user;
  }


  public async delete(id: number) {
    await this.repository.delete(id);
  }

}
