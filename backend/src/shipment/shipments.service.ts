import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { Repository } from 'typeorm';
import { ShipmentItem } from './entities/shipment-item.entity';
import { Item } from '../items/entities/item.entity';
import { CreateShipmentDto } from './dtos/shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {
  }

  public async findAll() {
    return this.shipmentRepository.find({
      relations: ['shipmentItems', 'shipmentItems.item'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async create(createShipmentDto: CreateShipmentDto) {
    const { items } = createShipmentDto;

    // we need to check that all items exist
    const itemIds = items.map(item => item.id);
    const foundItems = await this.itemRepository.findByIds(itemIds);

    if (foundItems.length !== itemIds.length) {
      const missingIds = itemIds.filter(id => !foundItems.find(item => item.id === id));
      throw new BadRequestException(`Items not found: ${missingIds.join(', ')}`);
    }
    // and that we have enough quanttiy
    for (const requestedItem of items) {
      const dbItem = foundItems.find(item => item.id === requestedItem.id);

      if (dbItem!.quantity <= 0) {
        throw new BadRequestException(
          `Item ${dbItem!.name} is out of stock. Available: ${dbItem!.quantity}`
        );
      }
      if (dbItem!.quantity < requestedItem.quantity) {
        throw new BadRequestException(
          `Not enough quantity for item ${dbItem!.name}. Available: ${dbItem!.quantity}, Requested: ${requestedItem.quantity}`
        );
      }
    }

    const shipment = new Shipment();
    let totalAmount = 0;
    const shipmentItems: ShipmentItem[] = [];

    for (const requestedItem of items) {
      const dbItem = foundItems.find(item => item.id === requestedItem.id);

      const shipmentItem = new ShipmentItem();
      shipmentItem.itemId = dbItem!.id;
      shipmentItem.quantity = requestedItem.quantity;
      shipmentItem.unitPrice = dbItem!.unitPrice;

      shipmentItems.push(shipmentItem);
      totalAmount += requestedItem.quantity * dbItem!.unitPrice;
    }

    shipment.totalAmount = totalAmount;
    shipment.shipmentItems = shipmentItems;

    const savedShipment = await this.shipmentRepository.save(shipment);

    // we still need to update the quantities of the warehouse items
    for (const requestedItem of items) {
      await this.itemRepository.decrement(
        { id: requestedItem.id },
        'quantity',
        requestedItem.quantity
      );
    }

    return savedShipment;
  }

  public async delete(id: number) {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['shipmentItems']
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    // restore quantity of existing items
    for (const shipmentItem of shipment.shipmentItems) {
      if (shipmentItem.itemId) {
        await this.itemRepository.increment(
          { id: shipmentItem.itemId },
          'quantity',
          shipmentItem.quantity
        );
      }
    }

    await this.shipmentRepository.remove(shipment);
  }
}
