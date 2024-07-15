import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TokenPayload } from '../../decor/token.decorator';
import { JwtPayload } from '../../interfaces/jwt.interface';
import { AccessTokenGuard } from '../auth/guards/token.guard';
import { ConfirmDTO } from './confirm.dto';
import { ConfirmService } from './confirm.service';


@Controller('confirmation')
export class ConfirmController {

  constructor(
    private readonly confirmService: ConfirmService) {
  }


  @UseGuards(AccessTokenGuard)
  @Get()
  public async findAllForUser(@TokenPayload() payload: JwtPayload) {
    return this.confirmService.findByOwner(payload.sub)
      .then(value => plainToInstance(ConfirmDTO, value));
  }


  @Get('confirm/:code')
  public async confirm(@Param('code', ParseIntPipe) code: number) {
    return this.confirmService.confirm(code);
  }


  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number, @TokenPayload() payload: JwtPayload) {
    return this.confirmService.deleteByIdAndOwner(id, payload.sub);
  }
}
