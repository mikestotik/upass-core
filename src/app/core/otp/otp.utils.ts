import { BadRequestException, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { OtpEntity } from '../../entities/otp.entity';


export class OtpUtils {

  public static validate(otp: OtpEntity | null) {
    if (!otp) {
      throw new NotFoundException('One time password not found');
    }
    if (dayjs().isAfter(otp.exp)) {
      throw new BadRequestException('One time password expired');
    }
  }

}