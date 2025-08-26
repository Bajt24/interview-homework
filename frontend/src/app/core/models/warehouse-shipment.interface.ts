import { WarehouseItem } from './warehouse-item.interface';

export interface Shipment {
  id: number;
  totalAmount: number;
  createdAt: string;
  shipmentItems: ShipmentItem[];
}

export interface ShipmentItem {
  id: number;
  itemId: number | null;
  quantity: number;
  unitPrice: number;
  item?: WarehouseItem;
}

export interface CreateShipmentDto {
  items: {
    id: number;
    quantity: number;
  }[];
}
