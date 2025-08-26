import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ShipmentsStateService } from '../../../core/states/shipments-state.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-shipping-bottom-bar',
  standalone: true,
  templateUrl: './shipping-bottom-bar.component.html',
  imports: [
    CurrencyPipe,
    NgIf,
    ButtonComponent
  ],
  styleUrls: ['./shipping-bottom-bar.component.scss']
})
export class ShippingBottomBarComponent {
  @Input() totalItems: number | null = 0;
  @Input() totalPrice: number | null = 0;
  @Output() onShipItems = new EventEmitter<void>();

  public shipItems() {
    this.onShipItems.emit();
  }
}
