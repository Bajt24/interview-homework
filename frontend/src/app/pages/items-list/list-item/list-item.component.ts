import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WarehouseItem} from "../../../core/models/warehouse-item.interface";
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() item: WarehouseItem

  constructor() { }
}
