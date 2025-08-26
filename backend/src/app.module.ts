import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from './config/db.config';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  imports: [
    ItemsModule,
    TypeOrmModule.forRoot({
      ...DbConfig.options,
      autoLoadEntities: true,
    }),
    ItemsModule,
    ShipmentModule
  ],
})
export class AppModule {
}
