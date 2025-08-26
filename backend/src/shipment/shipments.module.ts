import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { ShipmentItem } from './entities/shipment-item.entity';
import { Item } from '../items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, ShipmentItem, Item])],
  providers: [ShipmentsService],
  exports: [],
  controllers: [ShipmentsController]
})
export class ShipmentsModule {}
