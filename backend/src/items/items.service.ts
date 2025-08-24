import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { ItemDto, UpdateItemDto } from './dtos/item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  public async findAll() {
    return await this.itemRepository.find();
  }

  public async findOne(id: number) {
    const item = await this.itemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  public async create(createItemDto: ItemDto) {
    const item = this.itemRepository.create(createItemDto);
    return await this.itemRepository.save(item);
  }

  public async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    await this.findOne(id);

    await this.itemRepository.update(id, updateItemDto);

    return await this.findOne(id);
  }

  public async delete(id: number) {
    await this.findOne(id);

    await this.itemRepository.delete(id);

    return { message: `Item with ID ${id} has been deleted` };
  }
}
