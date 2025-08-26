import { Exclude } from "class-transformer";
import { Item } from "src/items/entities/item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shipment } from "./shipment.entity";

@Entity()
export class ShipmentItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shipment, shipment => shipment.shipmentItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shipmentId' })
  @Exclude()
  shipment: Shipment;

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
