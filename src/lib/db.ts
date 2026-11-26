/**
 * MySQL / MariaDB storage for consultation bookings (used on cPanel hosting such as Namecheap).
 * Configure with MYSQL_HOST (default localhost), MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE.
 * Tables are created on first use.
 */
import mysql from 'mysql2/promise';

export const mysqlConfigured = () => Boolean(process.env.MYSQL_DATABASE && process.env.MYSQL_USER);

let pool: mysql.Pool | null = null;
let ready: Promise<void> | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      connectionLimit: 4,
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: false,
    });
  }
  return pool;
}

/** One row per booking. `active_slot` holds the start time while the booking is confirmed and is
 *  UNIQUE, so two people can never claim the same slot (it becomes NULL when cancelled). */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS bookings (
     id CHAR(36) NOT NULL PRIMARY KEY,
     start_ms BIGINT NOT NULL,
     active_slot BIGINT NULL,
     status VARCHAR(16) NOT NULL,
     data TEXT NOT NULL,
     created_ms BIGINT NOT NULL,
     UNIQUE KEY uniq_active_slot (active_slot),
     KEY idx_start (start_ms)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS booking_blocks (
     kind VARCHAR(8) NOT NULL,
     value VARCHAR(32) NOT NULL,
     PRIMARY KEY (kind, value)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

export async function db() {
  const p = getPool();
  if (!ready) {
    ready = (async () => {
      for (const sql of SCHEMA) await p.query(sql);
    })().catch((err) => {
      ready = null; // retry on the next request
      throw err;
    });
  }
  await ready;
  return p;
}
