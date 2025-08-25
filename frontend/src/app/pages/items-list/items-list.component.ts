import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from "./list-item/list-item.component";
import { ItemsStateService } from '../../core/states/items-state.service';
import { Dialog } from '@angular/cdk/dialog';
import { ItemCreateModalComponent } from './create-item-modal/create-item-modal.component';
import { ButtonComponent } from '../../shared/button/button.component';

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

  public openEditDialog(id?: number) {
    this.dialog.open(ItemCreateModalComponent, {
      width: '500px',
      hasBackdrop: true,
      disableClose: false,
      data: {id},
    });
  }
}
