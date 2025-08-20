import pkg from 'pg';
const { Pool } = pkg;

import DBConfig from '../src/configs/db-config.js';

const pool = new Pool(DBConfig);

export default pool;