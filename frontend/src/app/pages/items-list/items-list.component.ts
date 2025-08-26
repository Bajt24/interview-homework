import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from "./list-item/list-item.component";
import { ItemsStateService } from '../../core/states/items-state.service';
import { Dialog } from '@angular/cdk/dialog';
import { ItemCreateModalComponent } from './create-item-modal/create-item-modal.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { take } from 'rxjs';
import { WarehouseItem } from '../../core/models/warehouse-item.interface';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ListItemComponent, ButtonComponent],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent {
  public items$ = this.state.items$;

  constructor(private state: ItemsStateService, private dialog: Dialog, private toast: ToastService) {
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
