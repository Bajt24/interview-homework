import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from './config/db.config';
import { ShipmentsModule } from './shipment/shipments.module';

@Module({
  imports: [
    ItemsModule,
    TypeOrmModule.forRoot({
      ...DbConfig.options,
      autoLoadEntities: true,
    }),
    ItemsModule,
    ShipmentsModule
  ],
})
export class AppModule {
}
