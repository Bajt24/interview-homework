import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Item } from './entities/item.entity';
import { CreateItemDto, UpdateItemDto } from './dtos/Item.dto';
import { NotFoundException } from '@nestjs/common';

const createItemFixture = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  name: 'Test Item',
  description: 'A test item description',
  imageUrl: 'https://example.com/test-image.jpg',
  quantity: 10,
  unitPrice: 25.99,
  ...overrides,
});

const createItemsFixture = (): Item[] => [
  createItemFixture({id: 1, name: 'Item 1', unitPrice: 10.99}),
  createItemFixture({id: 2, name: 'Item 2', unitPrice: 15.50, quantity: 5}),
  createItemFixture({id: 3, name: 'Item 3', unitPrice: 30.00, quantity: 0}),
];

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  const mockItemsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /items', () => {
    it('should create item with minimal required data', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Minimal Item',
        unitPrice: 9.99,
      };

      const expectedCreatedItem = createItemFixture({
        id: 5,
        name: 'Minimal Item',
        unitPrice: 9.99,
        description: undefined,
        imageUrl: undefined,
        quantity: 0,
      });

      mockItemsService.create.mockResolvedValue(expectedCreatedItem);

      const result = await controller.create(createItemDto);

      expect(result).toEqual(expectedCreatedItem);
      expect(service.create).toHaveBeenCalledWith(createItemDto);
    });

    it('should create a new item successfully', async () => {
      const createItemDto: CreateItemDto = {
        name: 'New Test Item',
        description: 'New item description',
        imageUrl: 'https://example.com/new-image.jpg',
        quantity: 15,
        unitPrice: 45.99,
      };

      const expectedCreatedItem = createItemFixture({
        id: 4,
        ...createItemDto,
      });

      mockItemsService.create.mockResolvedValue(expectedCreatedItem);

      const result = await controller.create(createItemDto);

      expect(result).toEqual(expectedCreatedItem);
      expect(service.create).toHaveBeenCalledWith(createItemDto);
    });
  });

  describe('GET /items/:id', () => {
    it('should return a single item when found', async () => {
      const expectedItem = createItemFixture();
      mockItemsService.findOne.mockResolvedValue(expectedItem);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedItem);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockItemsService.findOne.mockRejectedValue(
        new NotFoundException('Item with ID 999 not found')
      );

      await expect(controller.findOne(999)).rejects.toThrow(
        new NotFoundException('Item with ID 999 not found')
      );
    });
  });

  describe('GET /items', () => {
    it('should return an array of items', async () => {
      const expectedItems = createItemsFixture();
      mockItemsService.findAll.mockResolvedValue(expectedItems);

      const result = await controller.findAll();

      expect(result).toEqual(expectedItems);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no items exist', async () => {
      mockItemsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  })

  describe('PATCH /items/:id', () => {
    it('should update item with partial data', async () => {
      const updateItemDto: UpdateItemDto = {
        quantity: 50,
      };

      const expectedUpdatedItem = createItemFixture({
        quantity: 50,
      });

      mockItemsService.update.mockResolvedValue(expectedUpdatedItem);

      const result = await controller.update(1, updateItemDto);

      expect(result).toEqual(expectedUpdatedItem);
      expect(service.update).toHaveBeenCalledWith(1, updateItemDto);
    });

    it('should throw NotFoundException when updating non-existent item', async () => {
      const updateItemDto: UpdateItemDto = {name: 'Updated Name'};

      mockItemsService.update.mockRejectedValue(
        new NotFoundException('Item with ID 999 not found')
      );

      await expect(controller.update(999, updateItemDto)).rejects.toThrow(
        new NotFoundException('Item with ID 999 not found')
      );
    });
  });

  describe('DELETE /items/:id', () => {
    it('should delete an existing item', async () => {
      const expectedResponse = {message: 'Item with ID 1 has been deleted'};
      mockItemsService.delete.mockResolvedValue(expectedResponse);

      const result = await controller.remove(1);

      expect(result).toEqual(expectedResponse);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent item', async () => {
      mockItemsService.delete.mockRejectedValue(
        new NotFoundException('Item with ID 999 not found')
      );

      await expect(controller.remove(999)).rejects.toThrow(
        new NotFoundException('Item with ID 999 not found')
      );
    });
  })
});
