import { BadRequestException, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { ConfirmEntity } from '../../entities/confirm.entity';


export class ConfirmUtils {

  public static validate(confirmation: ConfirmEntity | null) {
    if (!confirmation) {
      throw new NotFoundException('Confirm record not found');
    }
    if (dayjs().isAfter(confirmation.exp)) {
      throw new BadRequestException('Confirmation code expired');
    }
  }

}