import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShipmentItem } from './shipment-item.entity';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ShipmentItem, shipmentItem => shipmentItem.shipment, { cascade: true })
  shipmentItems: ShipmentItem[];
}
