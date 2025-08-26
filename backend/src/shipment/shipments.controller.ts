import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateShipmentDto } from './dtos/shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { ShipmentsService } from './shipments.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentService: ShipmentsService) {}

  @Get()
  async findAll(): Promise<Shipment[]> {
    return this.shipmentService.findAll();
  }

  @Post()
  async create(@Body() createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    return this.shipmentService.create(createShipmentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.delete(id);
  }
}
