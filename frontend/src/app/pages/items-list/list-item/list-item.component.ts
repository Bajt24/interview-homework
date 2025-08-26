import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseItem } from "../../../core/models/warehouse-item.interface";
import { ButtonComponent } from '../../../shared/button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() item: WarehouseItem
  @Output() onItemEdit = new EventEmitter<number>();
  @Output() onItemDelete = new EventEmitter<WarehouseItem>();
  @Output() onUpdateShipping = new EventEmitter<{ id: number, quantity: number}>();

  public selectedQuantity = 0;

  public addSelectedQuantity() {
    this.selectedQuantity++;

    if (this.item.quantity && this.selectedQuantity > this.item.quantity) {
      this.selectedQuantity = this.item.quantity;
    }

    this.emitShippmentQuantity();
  }

  public onQuantityChange(newQuantity: number) {
    const intQuantity = Math.floor(Math.abs(newQuantity));

    if (intQuantity < 0) {
      this.selectedQuantity = 0;
    } else if (this.item.quantity && intQuantity > this.item.quantity) {
      this.selectedQuantity = this.item.quantity;
    } else {
      this.selectedQuantity = intQuantity;
    }
    this.emitShippmentQuantity();
  }

  public emitShippmentQuantity() {
    this.onUpdateShipping.emit({id: this.item.id, quantity: this.selectedQuantity});
  }
}
