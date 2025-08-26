import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { ShipmentItem } from './entities/shipment-item.entity';
import { Item } from '../items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, ShipmentItem, Item])],
  providers: [ShipmentService],
  exports: [],
  controllers: [ShipmentController]
})
export class ShipmentModule {}
