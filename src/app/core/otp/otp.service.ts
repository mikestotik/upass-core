import { BadRequestException, ForbiddenException, Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { RandomUtils } from '../../utils/random.utils';
import { UserEmailDTO } from '../user/user.dto';
import { UserStatus } from '../user/user.enum';
import { UserService } from '../user/user.service';
import { CreateOtpDTO } from './otp.dto';
import { OtpEntity } from '../../entities/otp.entity';
import { OtpType } from './otp.enum';
import { OtpUtils } from './otp.utils';


@Injectable()
export class OtpService {


  constructor(
    @InjectRepository(OtpEntity)
    private readonly repository: Repository<OtpEntity>,
    private readonly userService: UserService) {
  }


  public findByOwner(ownerId: number) {
    return this.repository.findBy({ owner: { id: ownerId } });
  }


  public findByCode(code: number): Promise<OtpEntity | null> {
    return this.repository.findOneBy({ code });
  }


  public create(userId: number, dto: CreateOtpDTO) {
    return this.repository.save(
      plainToInstance(OtpEntity, { ...dto, owner: { id: userId } }),
    );
  }


  public async confirm(code: number) {
    const entity = await this.findByCode(code);

    OtpUtils.validate(entity);

    switch (entity!.type) {
      case OtpType.EmailConfirm:
        return this.handleEmailConfirm(entity as OtpEntity<UserEmailDTO>);
      case OtpType.ChangePasswordConfirm:
        return this.handleChangePasswordConfirm(entity);
    }
  }


  private async handleEmailConfirm({ data }: OtpEntity<UserEmailDTO>) {
    const user = await this.validateUserEmail(data!.email);

    await this.userService.update(user.id, {
      status: UserStatus.Activated,
    });
  }


  public createEmailConfirmation(userId: number, email: string) {
    return this.create(userId, {
      code: RandomUtils.generateCode(),
      type: OtpType.EmailConfirm,
      data: { email },
      exp: dayjs().add(3600, 'second').toDate(),
    });
  }


  private handleChangePasswordConfirm(entity: OtpEntity<object> | null) {
    throw new NotImplementedException();
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
