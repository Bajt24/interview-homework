import { Component, OnDestroy } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { ItemsStateService } from '../../../core/states/items-state.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { CreateWarehouseItemDto } from '../../../core/models/warehouse-item.interface';
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
  public error$ = this.state.error$;
  private destroy$ = new Subject<void>();

  public itemForm = this.fb.group({
    name: ['', Validators.required],
    quantity: [0],
    unitPrice: [null, [Validators.required, Validators.min(0.01)]],
    description: [''],
    imageUrl: ['']
  });

  constructor(
    private dialogRef: DialogRef<ItemCreateModalComponent>,
    private state: ItemsStateService,
    private fb: FormBuilder,
  ) {
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

    this.state.createItem(newItem).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: () => {
        this.dialogRef.close();
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
