import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CreateItemDto } from './Item.dto';

describe('ItemDto validation', () => {
  it('should pass validation with all required fields', async () => {
    const validDto = {
      name: 'Test Item',
      unitPrice: 25.99,
    };

    const dto = plainToClass(CreateItemDto, validDto);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should pass validation with all fields provided', async () => {
    const validDto = {
      name: 'Test Item',
      description: 'A test item',
      imageUrl: 'https://example.com/image.jpg',
      quantity: 10,
      unitPrice: 25.99,
    };

    const dto = plainToClass(CreateItemDto, validDto);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should test Transform decorator for unitPrice precision', async () => {
    const validDto = {
      name: 'Test Item',
      unitPrice: 25.999999,
    };

    const dto = plainToClass(CreateItemDto, validDto);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.unitPrice).toBe(26.00);
  });

  it('should fail validation when unitPrice is not positive', async () => {
    const invalidDto = {
      name: 'Test Item',
      unitPrice: -10.99,
    };

    const dto = plainToClass(CreateItemDto, invalidDto);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const priceError = errors.find(error => error.property === 'unitPrice');
    expect(priceError?.constraints).toHaveProperty('isPositive');
  });

  it('should fail validation when quantity is not an integer', async () => {
    const invalidDto = {
      name: 'Test Item',
      unitPrice: 25.99,
      quantity: 'not-a-number' as any,
    };

    const dto = plainToClass(CreateItemDto, invalidDto);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const quantityError = errors.find(error => error.property === 'quantity');
    expect(quantityError?.constraints).toHaveProperty('isInt');
  });

  it('should fail validation when imageUrl is invalid', async () => {
    const invalidDto = {
      imageUrl: 'invalid-url',
    };

    const dto = plainToClass(CreateItemDto, invalidDto);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const imageError = errors.find(error => error.property === 'imageUrl');
    expect(imageError?.constraints).toHaveProperty('isUrl');
  });
})
