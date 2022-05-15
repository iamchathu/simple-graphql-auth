import { DataSource } from 'typeorm';
import config from '.';
import { User } from '../database/entities/user';
import { UserTable1652603350689 } from '../database/migrations/1652603350689-user-table';
import { UserSeed1652603387591 } from '../database/migrations/1652603387591-user-seed';

export const dataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.database,
  entities: [User],
  synchronize: process.env?.NODE_ENV === 'test' ?? false,
  dropSchema: process.env?.NODE_ENV === 'test' ?? false,
  migrationsTableName: 'db_migration',
  migrations: [UserTable1652603350689, UserSeed1652603387591],
  logging: process.env?.NODE_ENV !== 'production' ?? true,
  relationLoadStrategy: 'join',
  migrationsRun: process.env?.NODE_ENV !== 'production' ?? false,
});
