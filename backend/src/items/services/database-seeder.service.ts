import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  private async seedInitialData() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(mockItems);
      console.log('Initial data seeded');
    }
  }
}

const mockItems = [
  {
    name: 'Laptop Dell XPS 13',
    description: 'High-performance ultrabook with 11th gen Intel processor',
    quantity: 25,
    unitPrice: 1299.99,
  },
  {
    name: 'Wireless Mouse Logitech MX Master 3',
    description: 'Advanced wireless mouse with ultra-fast scrolling',
    quantity: 150,
    unitPrice: 89.99,
  },
  {
    name: 'USB-C Hub Anker 7-in-1',
    description: 'Multi-port hub with HDMI, USB 3.0, and SD card slots',
    quantity: 75,
    unitPrice: 49.99,
  },
  {
    name: 'Mechanical Keyboard Keychron K2',
    description: 'Compact wireless mechanical keyboard with RGB backlighting',
    quantity: 30,
    unitPrice: 129.00,
  },
  {
    name: 'Monitor 27" 4K LG UltraFine',
    description: '27-inch 4K display with USB-C connectivity',
    quantity: 12,
    unitPrice: 549.95,
  },
  {
    name: 'Webcam Logitech C920 HD',
    description: '1080p HD webcam with auto-focus and noise reduction',
    quantity: 60,
    unitPrice: 79.99,
  },
  {
    name: 'Desk Lamp LED Adjustable',
    description: 'Adjustable LED desk lamp with touch controls',
    quantity: 45,
    unitPrice: 34.95,
  },
  {
    name: 'Smartphone Stand Aluminum',
    description: 'Adjustable aluminum stand for smartphones and tablets',
    quantity: 85,
    unitPrice: 19.99,
  },
  {
    name: 'Noise Cancelling Headphones Sony WH-1000XM4',
    description: 'Premium noise cancelling wireless headphones',
    quantity: 8,
    unitPrice: 299.99,
  },
  {
    name: 'Portable SSD 1TB Samsung T7',
    description: 'High-speed portable SSD with USB-C connectivity',
    quantity: 40,
    unitPrice: 159.99,
  },
];
