import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { ConfigService } from '../../config/config.service';
import { RoleEntity } from '../../entities/role.entity';
import { UserEntity } from '../../entities/user.entity';
import { CryptoUtils } from '../../utils/crypto.utils';
import { Role } from '../role/role.enum';
import { RoleService } from '../role/role.service';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { UserStatus } from './user.enum';
import { UserUtils } from './user.utils';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly roleService: RoleService,
    private readonly config: ConfigService) {
  }


  public findAll() {
    const options: FindManyOptions<UserEntity> = {};
    try {
      return this.repository.find(options);
    } catch (e) {
      const error = e as QueryFailedError;
      throw new InternalServerErrorException(error.message);
    }
  }


  public async findOne(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException(`User with id: ${ id } does not exist.`);
    }
    return user;
  }


  public findById(id: number): Promise<UserEntity | null> {
    return this.repository.findOneBy({ id });
  }


  public findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOneBy({ email });
  }


  public async create(dto: CreateUserDTO, role?: Role): Promise<UserEntity> {
    UserUtils.validateEmail(dto.email);
    UserUtils.validatePassword(dto.password);

    const user = await this.findByEmail(dto.email);
    if (user) {
      throw new BadRequestException(`User with email: ${ dto.email } exists.`);
    }

    const roles: (RoleEntity | null)[] = await Promise.all(
      [ role || Role.User ].map(role => this.roleService.findByRole(role))
    );

    try {
      return this.repository.save({
        email: dto.email,
        password: CryptoUtils.hash(dto.password, this.config.crypto.saltOrRounds),
        fullName: dto.fullName,
        roles: roles.filter(role => !!role) as RoleEntity[],
        status: dto.status
      });
    } catch (e) {
      const error = e as QueryFailedError;
      throw new InternalServerErrorException(error.message);
    }
  }


  public async update(id: number, dto: Partial<UpdateUserDTO>): Promise<UserEntity> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    let value: object;

    if (dto.roles) {
      const roles: RoleEntity[] = <RoleEntity[]> await Promise.all(dto.roles.map(role => this.roleService.findByRole(role)));
      value = { ...user, ...dto, roles };
    } else {
      value = { ...user, ...dto };
    }
    return this.repository.save(value);
  }


  public updatePassword(id: number, password: string): Promise<UpdateResult> {
    password = CryptoUtils.hash(password, this.config.crypto.saltOrRounds);

    return this.repository.update(id, { password });
  }


  public async updateRefreshToken(id: number, refreshToken: string | undefined) {
    if (refreshToken) {
      refreshToken = CryptoUtils.hash(refreshToken, this.config.crypto.saltOrRounds);
    }
    return this.repository.update(id, { refreshToken });
  }


  public async remove(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      const error = e as QueryFailedError;
      throw new InternalServerErrorException(error.message);
    }
  }


  public async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (!CryptoUtils.compareHashes(password, user.password)) {
      throw new BadRequestException('Incorrect password');
    }
    switch (user.status) {
      case UserStatus.Activated:
      case UserStatus.Deleted:
        return user;
      case UserStatus.PendingPasswordChangeConfirmation:
        throw new ForbiddenException('You must confirm the password change');
      case UserStatus.PendingEmailConfirmation:
        throw new ForbiddenException('You need to confirm your email address');
      case UserStatus.Archived:
        throw new ForbiddenException('The account is archived; to restore it, contact your administrator.');
      default:
        return user;
    }
  }

}