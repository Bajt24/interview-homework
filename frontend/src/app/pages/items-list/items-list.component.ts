import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from "./list-item/list-item.component";
import { ItemsStateService } from '../../core/states/items-state.service';
import { Dialog } from '@angular/cdk/dialog';
import { ItemCreateModalComponent } from './create-item-modal/create-item-modal.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ListItemComponent, ButtonComponent],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent {
  public items$ = this.state.items$;

  constructor(private state: ItemsStateService, private dialog: Dialog) {
  }

  public openCreateDialog() {
    this.dialog.open(ItemCreateModalComponent);
  }

  public openEditDialog(id: number) {
    this.state.itemByIdSelector(id).pipe(take(1)).subscribe(val => {
      this.dialog.open(ItemCreateModalComponent, {data: val});
    })
  }
}
