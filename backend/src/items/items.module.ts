import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { DatabaseSeederService } from './services/database-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemsService, DatabaseSeederService],
  exports: [],
  controllers: [ItemsController]
})
export class ItemsModule {}
