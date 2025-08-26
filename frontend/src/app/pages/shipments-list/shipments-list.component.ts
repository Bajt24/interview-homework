import { Component } from '@angular/core';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ShipmentsStateService } from '../../core/states/shipments-state.service';
import { take } from 'rxjs';
import { Shipment } from '../../core/models/warehouse-shipment.interface';
import { AsyncPipe, NgForOf } from '@angular/common';
import { ShipmentListItemComponent } from './shipment-list-item/shipment-list-item.component';
@Component({
  selector: 'app-items-list',
  standalone: true,
  templateUrl: './shipments-list.component.html',
  imports: [
    NgForOf,
    ShipmentListItemComponent,
    AsyncPipe
  ],
  styleUrls: ['./shipments-list.component.scss']
})
export class ShipmentsListComponent {
  public shipments$ = this.state.shipments$;

  constructor(
    private toast: ToastService,
    private state: ShipmentsStateService,
  ) {
  }

  public deleteItem(item: Shipment) {
    const confirmMessage = `Are you sure you want to delete this shipment? This action cannot be undone.`;

    if (confirm(confirmMessage)) {
      this.state.deleteShipment(item.id).pipe(
        take(1)
      ).subscribe({
          next: () => {
            this.toast.showSuccess('Shipment deleted successfully.');
          },
          error: (err) => {
            this.toast.showDanger(err);
          }
        }
      );
    }
  }
}
