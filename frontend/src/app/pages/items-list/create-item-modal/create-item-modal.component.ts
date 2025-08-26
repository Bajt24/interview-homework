import { Component, Inject, OnDestroy } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ItemsStateService } from '../../../core/states/items-state.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { CreateWarehouseItemDto, WarehouseItem } from '../../../core/models/warehouse-item.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-item-modal',
  templateUrl: './create-item-modal.component.html',
  styleUrls: ['./create-item-modal.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    AsyncPipe
  ]
})
export class ItemCreateModalComponent implements OnDestroy {
  public loading$ = this.state.loading$;
  private destroy$ = new Subject<void>();

  public error: string | null = null;

  public itemForm = this.fb.group({
    name: ['', Validators.required],
    quantity: [0],
    unitPrice: [0, [Validators.required, Validators.min(0.01)]],
    description: [''],
    imageUrl: ['']
  });

  constructor(
    private dialogRef: DialogRef<ItemCreateModalComponent>,
    private state: ItemsStateService,
    private fb: FormBuilder,
    @Inject(DIALOG_DATA) public editedItem: WarehouseItem
  ) {
    if (!this.editedItem) {
      return;
    }
    this.itemForm.patchValue(editedItem);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onSubmit() {
    const formValues = this.itemForm.value;
    const newItem: CreateWarehouseItemDto = this.removeNullValues(formValues) as unknown as CreateWarehouseItemDto;

    const operation$ = this.editedItem
      ? this.state.updateItem(this.editedItem.id, newItem)
      : this.state.createItem(newItem);

    operation$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: (err) => {
        this.error = err;
      }
    });
  }

  private removeNullValues<T>(obj: Partial<T>): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) =>
        value !== null && value !== undefined && value !== ''
      )
    ) as Partial<T>;
  }
}
