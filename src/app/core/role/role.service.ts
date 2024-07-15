import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.enum';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import { RoleEntity } from '../../entities/role.entity';


@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>) {
  }


  public findByRole(name: Role): Promise<RoleEntity | null> {
    return this.repository.findOneBy({ title: name });
  }


  public create(dto: CreateRoleDTO): Promise<RoleEntity> {
    return this.repository.save(dto);
  }


  public findAll(): Promise<RoleEntity[]> {
    return this.repository.find();
  }


  public findOne(id: number): Promise<RoleEntity | null> {
    return this.repository.findOneBy({ id });
  }


  public update(id: number, dto: UpdateRoleDTO): Promise<RoleEntity | null> {
    return this.repository.update(id, dto)
      .then(() => this.findOne(id));
  }


  public async remove(id: number): Promise<void> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) {
      throw new BadRequestException('This entry does not exist');
    }
    await this.repository.delete(id);
  }
}