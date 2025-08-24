import { DataSource } from "typeorm";

export const DbConfig = new DataSource({
  type: 'sqlite',
  database: 'warehouse.sqlite',
  entities: [__dirname + '/**/**.entity.js'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  extra: {
    foreignKeys: true,
  },
});
