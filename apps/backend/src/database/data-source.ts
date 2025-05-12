import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { getDataSourceConfig } from './ormconfig';

config(); // Load .env file

export default new DataSource(getDataSourceConfig());
