import { Item } from "../../items/entities/item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shipment } from "./shipment.entity";

@Entity()
export class ShipmentItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shipment, shipment => shipment.shipmentItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shipmentId' })
  shipment?: Shipment;

  @Column()
  shipmentId: number;
  @ManyToOne(() => Item, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}
