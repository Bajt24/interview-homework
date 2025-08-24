import { DataSource } from "typeorm";

export const DbConfig = new DataSource({
  type: 'sqlite',
  database: 'warehouse.sqlite',
  entities: [__dirname + '/**/**.entity.js'],
  synchronize: true, // WARN: definitely not safe for production, but for local development it will do
  extra: {
    foreignKeys: true,
  },
});
