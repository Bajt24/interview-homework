import { ItemsApiService } from '../services/items-api.service';
import { ItemsStateService } from './items-state.service';
import { CreateWarehouseItemDto, WarehouseItem } from '../models/warehouse-item.interface';
import { TestBed } from '@angular/core/testing';
import { of, take, throwError } from 'rxjs';

describe('ItemsStateService', () => {
  let service: ItemsStateService;
  let apiServiceMock: jasmine.SpyObj<ItemsApiService>;

  const mockItems: WarehouseItem[] = [
    {id: 1, name: 'Item 1', unitPrice: 10.99},
    {id: 2, name: 'Item 2', unitPrice: 25.50}
  ];

  beforeEach(() => {
    apiServiceMock = jasmine.createSpyObj('ItemsApiService', ['getAll', 'create', 'update', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ItemsStateService,
        {provide: ItemsApiService, useValue: apiServiceMock}
      ]
    });

    service = TestBed.inject(ItemsStateService);
  });

  it('should load items and update state', () => {
    apiServiceMock.getAll.and.returnValue(of(mockItems));

    service.loadItems().subscribe();

    service.items$.subscribe(items => {
      expect(items).toEqual(mockItems);
    });
  });

  it('should add new item to state when created', () => {
    const newItem: CreateWarehouseItemDto = {name: 'New Item', unitPrice: 15.99};
    const createdItem: WarehouseItem = {id: 3, ...newItem};

    apiServiceMock.create.and.returnValue(of(createdItem));

    service.createItem(newItem).subscribe();

    service.items$.subscribe(items => {
      expect(items).toContain(createdItem);
    });
  });

  it('should update existing item in state', () => {
    apiServiceMock.getAll.and.returnValue(of(mockItems));
    service.loadItems().subscribe();

    const updatedItem: WarehouseItem = {id: 1, name: 'Updated Item', unitPrice: 20.99};
    apiServiceMock.update.and.returnValue(of(updatedItem));

    service.updateItem(1, {name: 'Updated Item'}).subscribe();

    service.items$.subscribe(items => {
      const item = items.find(i => i.id === 1);
      expect(item?.name).toBe('Updated Item');
      expect(item?.unitPrice).toBe(20.99);
    });
  });

  it('should remove item from state when deleted', () => {
    apiServiceMock.getAll.and.returnValue(of(mockItems));
    service.loadItems().subscribe();

    apiServiceMock.delete.and.returnValue(of(void 0));

    service.deleteItem(1).subscribe();

    service.items$.subscribe(items => {
      expect(items.find(i => i.id === 1)).toBeUndefined();
      expect(items.length).toBe(1);
    });
  });

  it('should handle load errors and set error state', () => {
    const error = new Error('API Error');
    apiServiceMock.getAll.and.returnValue(throwError(() => error));

    service.loadItems().subscribe({
      error: () => {
      }
    });

    service.error$.subscribe(errorMessage => {
      expect(errorMessage).toBe('Unable to load items');
    });

    service.loading$.subscribe(loading => {
      expect(loading).toBe(false);
    });
  });

  it('should handle backend validation errors with HTML formatting', () => {
    const newItem: CreateWarehouseItemDto = {name: '', unitPrice: -5};
    const backendError = {
      error: {
        message: ['Name is required', 'Price must be positive']
      }
    };

    apiServiceMock.create.and.returnValue(throwError(() => backendError));

    service.createItem(newItem).subscribe({
      error: () => {
      }
    });

    service.error$.subscribe(errorMessage => {
      expect(errorMessage).toBe('Name is required<br>Price must be positive');
    });
  });

  it('should fallback to default error message for unexpected errors', () => {
    const newItem: CreateWarehouseItemDto = {name: 'Test', unitPrice: 10};
    const unexpectedError = {status: 500, message: 'Server Error'};

    apiServiceMock.create.and.returnValue(throwError(() => unexpectedError));

    service.createItem(newItem).subscribe({
      error: () => {
      }
    });

    service.error$.subscribe(errorMessage => {
      expect(errorMessage).toBe('Failed to create item');
    });
  });

  it('should clear error state when starting new operations', () => {
    const error = new Error('Previous error');
    apiServiceMock.getAll.and.returnValue(throwError(() => error));
    service.loadItems().subscribe({
      error: () => {
      }
    });

    let errorMessage1: string | null = '';
    service.error$.pipe(take(1)).subscribe(err => {
      errorMessage1 = err;
    });
    expect(errorMessage1).toBe('Unable to load items');

    const newItem: CreateWarehouseItemDto = {name: 'New Item', unitPrice: 15.99};
    const createdItem: WarehouseItem = {id: 3, ...newItem};
    apiServiceMock.create.and.returnValue(of(createdItem));

    service.createItem(newItem).subscribe();

    let errorMessage2: string | null = '';
    service.error$.pipe(take(1)).subscribe(err => {
      errorMessage2 = err;
    });
    expect(errorMessage2).toBeNull();
  });
})
