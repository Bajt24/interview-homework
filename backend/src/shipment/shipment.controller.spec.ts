import { ShipmentItem } from './entities/shipment-item.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentController } from './shipment.controller';

import { ShipmentService } from './shipment.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateShipmentDto } from './dtos/shipment.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Item } from '../items/entities/item.entity';

const createItemFixture = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  name: 'Test Item',
  description: 'A test item description',
  imageUrl: 'https://example.com/test-image.jpg',
  quantity: 10,
  unitPrice: 25.99,
  ...overrides,
});

const createShipmentItemFixture = (overrides: Partial<ShipmentItem> = {}): ShipmentItem => ({
  id: 1,
  shipmentId: 1,
  itemId: 1,
  quantity: 2,
  unitPrice: 25.99,
  shipment: undefined,
  item: createItemFixture(),
  ...overrides,
});

const createShipmentFixture = (overrides: Partial<Shipment> = {}): Shipment => ({
  id: 1,
  totalAmount: 51.98,
  createdAt: new Date('2023-01-01T10:00:00Z'),
  shipmentItems: [
    createShipmentItemFixture(),
    createShipmentItemFixture({
      id: 2,
      itemId: 2,
      quantity: 1,
      unitPrice: 15.50,
      item: createItemFixture({ id: 2, name: 'Item 2', unitPrice: 15.50 })
    }),
  ],
  ...overrides,
});

const createShipmentsFixture = (): Shipment[] => [
  createShipmentFixture({ id: 1, totalAmount: 51.98 }),
  createShipmentFixture({
    id: 2,
    totalAmount: 89.97,
    createdAt: new Date('2023-01-02T14:30:00Z')
  }),
];

describe('ShipmentController', () => {
  let controller: ShipmentController;
  let service: ShipmentService;

  const mockShipmentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentController],
      providers: [
        {
          provide: ShipmentService,
          useValue: mockShipmentService,
        },
      ],
    }).compile();

    controller = module.get<ShipmentController>(ShipmentController);
    service = module.get<ShipmentService>(ShipmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /shipment', () => {
    it('should create shipment with multiple items and calculate total correctly', async () => {
      const createShipmentDto: CreateShipmentDto = {
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 3 }
        ]
      };

      const expectedCreatedShipment = createShipmentFixture({
        id: 1,
        totalAmount: 98.48, // (2 × 25.99) + (3 × 15.50)
        shipmentItems: [
          createShipmentItemFixture({
            id: 1,
            itemId: 1,
            quantity: 2,
            unitPrice: 25.99
          }),
          createShipmentItemFixture({
            id: 2,
            itemId: 2,
            quantity: 3,
            unitPrice: 15.50,
            item: createItemFixture({ id: 2, name: 'Item 2', unitPrice: 15.50 })
          }),
        ]
      });

      mockShipmentService.create.mockResolvedValue(expectedCreatedShipment);

      const result = await controller.create(createShipmentDto);

      expect(result).toEqual(expectedCreatedShipment);
      expect(service.create).toHaveBeenCalledWith(createShipmentDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when item has zero quantity', async () => {
      const createShipmentDto: CreateShipmentDto = {
        items: [
          { id: 3, quantity: 1 } // item 3 has 0 quantity in stock
        ]
      };

      const outOfStockError = new BadRequestException('Item Test Item is out of stock. Available: 0');
      mockShipmentService.create.mockRejectedValue(outOfStockError);

      await expect(controller.create(createShipmentDto)).rejects.toThrow(BadRequestException);
      await expect(controller.create(createShipmentDto)).rejects.toThrow('Item Test Item is out of stock. Available: 0');

      expect(service.create).toHaveBeenCalledWith(createShipmentDto);
    });

    it('should throw BadRequestException when requested quantity exceeds available stock', async () => {
      const createShipmentDto: CreateShipmentDto = {
        items: [
          { id: 1, quantity: 15 } // item 1 has only 10 in stock
        ]
      };

      const insufficientStockError = new BadRequestException('Not enough quantity for item Test Item. Available: 10, Requested: 15');
      mockShipmentService.create.mockRejectedValue(insufficientStockError);

      await expect(controller.create(createShipmentDto)).rejects.toThrow(BadRequestException);
      await expect(controller.create(createShipmentDto)).rejects.toThrow('Not enough quantity for item Test Item. Available: 10, Requested: 15');

      expect(service.create).toHaveBeenCalledWith(createShipmentDto);
    });
  });

  describe('GET /shipment', () => {
    it('should return all shipments with item details', async () => {
      const expectedShipments = createShipmentsFixture();

      mockShipmentService.findAll.mockResolvedValue(expectedShipments);

      const result = await controller.findAll();

      expect(result).toEqual(expectedShipments);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /shipment/:id', () => {
    it('should delete shipment successfully', async () => {
      const shipmentId = 1;

      mockShipmentService.delete.mockResolvedValue(undefined);

      const result = await controller.remove(shipmentId);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(shipmentId);
      expect(service.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when deleting non-existent shipment', async () => {
      const nonExistentId = 999;

      const notFoundError = new NotFoundException(`Shipment with ID ${nonExistentId} not found`);
      mockShipmentService.delete.mockRejectedValue(notFoundError);

      await expect(controller.remove(nonExistentId)).rejects.toThrow(NotFoundException);
      await expect(controller.remove(nonExistentId)).rejects.toThrow(`Shipment with ID ${nonExistentId} not found`);

      expect(service.delete).toHaveBeenCalledWith(nonExistentId);
    });

  })
});
