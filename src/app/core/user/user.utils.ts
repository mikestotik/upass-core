import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';


export class UserUtils {

  public static validateEmail(email: string): void {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!isEmail(email)) {
      throw new BadRequestException('Wrong email format');
    }
  }


  public static validatePassword(password: string): void {
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    if (password.length < 4) {
      throw new BadRequestException('Incorrect password. Password length must be greater than or equal to four characters.');
    }
  }


  public static validateCode(code: number) {
    if (!code || isNaN(Number(code)) || String(code).length !== 6) {
      throw new BadRequestException('Wrong activation code');
    }
  }


  public static parseEmailUsername(email: string): string {
    return email.split('@')[0];
  }
}