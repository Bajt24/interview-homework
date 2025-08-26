import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from "./list-item/list-item.component";
import { ItemsStateService } from '../../core/states/items-state.service';
import { Dialog } from '@angular/cdk/dialog';
import { ItemCreateModalComponent } from './create-item-modal/create-item-modal.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { BehaviorSubject, combineLatest, map, take } from 'rxjs';
import { WarehouseItem } from '../../core/models/warehouse-item.interface';
import { ToastService } from '../../shared/services/toast.service';
import { ShippingBottomBarComponent } from './shipping-bottom-bar/shipping-bottom-bar.component';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ListItemComponent, ButtonComponent, ShippingBottomBarComponent],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent {
  public items$ = this.state.items$;

  private shippingSubject = new BehaviorSubject<Record<number, number>>({});
  public shippingObservable = this.shippingSubject.asObservable();

  public totalItems$ = this.shippingObservable.pipe(
    map(quantities => Object.values(quantities).reduce((sum, qty) => sum + qty, 0))
  );

  public totalPrice$ = combineLatest([this.items$, this.shippingObservable]).pipe(
    map(([items, quantities]) =>
      Object.entries(quantities).reduce((sum, [id, qty]) => {
        const item = items.find(i => i.id === +id);
        return sum + (item ? qty * item.unitPrice : 0);
      }, 0)
    )
  );

  constructor(private state: ItemsStateService, private dialog: Dialog, private toast: ToastService) {
  }

  public updateShipping(itemId: number, quantity: number): void {
    const current = this.shippingSubject.value;

    if (quantity <= 0) {
      const { [itemId]: removed, ...rest } = current;
      this.shippingSubject.next(rest);
    } else {
      this.shippingSubject.next({ ...current, [itemId]: quantity });
    }
  }

  public openCreateDialog() {
    this.dialog.open(ItemCreateModalComponent);
  }

  public openEditDialog(id: number) {
    this.state.itemByIdSelector(id).pipe(take(1)).subscribe(val => {
      this.dialog.open(ItemCreateModalComponent, {data: val});
    })
  }

  public deleteItem(item: WarehouseItem) {
    const confirmMessage = `Are you sure you want to delete "${item.name}"? This action cannot be undone.`;

    if (confirm(confirmMessage)) {
      this.state.deleteItem(item.id).pipe(
        take(1)
      ).subscribe({
          next: () => {
            this.toast.showSuccess('Item deleted successfully.');
          },
          error: (err) => {
            this.toast.showDanger(err);
          }
        }
      );
    }
  }
}
