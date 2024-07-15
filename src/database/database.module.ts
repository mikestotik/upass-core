import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database.source';


@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options)
  ],
  exports: [
    TypeOrmModule
  ]
})
export class DatabaseModule {}
