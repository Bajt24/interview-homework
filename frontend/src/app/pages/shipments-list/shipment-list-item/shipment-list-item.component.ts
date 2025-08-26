import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shipment } from '../../../core/models/warehouse-shipment.interface';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-shipment-list-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './shipment-list-item.component.html',
  styleUrls: ['./shipment-list-item.component.scss']
})
export class ShipmentListItemComponent {
  @Input() item: Shipment;
  @Output() onItemDelete = new EventEmitter<Shipment>();

  public get totalItemCount() {
    return this.item.shipmentItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
}
