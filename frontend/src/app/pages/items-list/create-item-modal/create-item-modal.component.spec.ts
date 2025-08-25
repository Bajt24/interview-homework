import { ItemCreateModalComponent } from './create-item-modal.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsStateService } from '../../../core/states/items-state.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ItemCreateModalComponent', () => {
  let component: ItemCreateModalComponent;
  let fixture: ComponentFixture<ItemCreateModalComponent>;
  let mockStateService: jasmine.SpyObj<ItemsStateService>;
  let mockDialogRef: jasmine.SpyObj<DialogRef<ItemCreateModalComponent>>;

  describe('Create item', () => {
    beforeEach(async () => {
      mockStateService = jasmine.createSpyObj('ItemsStateService', ['createItem', 'updateItem']);
      mockDialogRef = jasmine.createSpyObj('DialogRef', ['close']);

      await TestBed.configureTestingModule({
        imports: [ItemCreateModalComponent, ReactiveFormsModule],
        providers: [
          {provide: ItemsStateService, useValue: mockStateService},
          {provide: DialogRef, useValue: mockDialogRef},
          {provide: DIALOG_DATA, useValue: {}}
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ItemCreateModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values for create mode', () => {
      expect(component.itemForm.get('name')?.value).toBe('');
      expect(component.itemForm.get('unitPrice')?.value).toBe(0);
      expect(component.itemForm.get('quantity')?.value).toBe(0);
      expect(component.itemForm.get('description')?.value).toBe('');
      expect(component.itemForm.get('imageUrl')?.value).toBe('');
    });
  })

  describe('Edit Mode', () => {
    beforeEach(async () => {
      mockStateService = jasmine.createSpyObj('ItemsStateService', ['createItem', 'updateItem']);
      mockDialogRef = jasmine.createSpyObj('DialogRef', ['close']);

      await TestBed.configureTestingModule({
        imports: [ItemCreateModalComponent, ReactiveFormsModule],
        providers: [
          { provide: ItemsStateService, useValue: mockStateService },
          { provide: DialogRef, useValue: mockDialogRef },
          { provide: DIALOG_DATA, useValue: {
              id: 1,
              name: 'Existing Item',
              unitPrice: 15.99,
              quantity: 3
            }}
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ItemCreateModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should prefill form with existing item data', () => {
      expect(component.itemForm.get('name')?.value).toBe('Existing Item');
      expect(component.itemForm.get('unitPrice')?.value).toBe(15.99);
      expect(component.itemForm.get('quantity')?.value).toBe(3);
    });

    it('should call updateItem instead of createItem', () => {
      const updatedItem = { id: 1, name: 'Updated Item', unitPrice: 20.99 };
      mockStateService.updateItem.and.returnValue(of(updatedItem));

      component.itemForm.patchValue({
        name: 'Updated Item',
        unitPrice: 20.99
      });

      component.onSubmit();

      expect(mockStateService.updateItem).toHaveBeenCalledWith(1, jasmine.any(Object));
      expect(mockStateService.createItem).not.toHaveBeenCalled();
    });
  });
})
