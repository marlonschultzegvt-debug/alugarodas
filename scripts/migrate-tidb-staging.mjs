import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const url = process.env.TIDB_DATABASE_URL;
const caPath = process.env.TIDB_CA_PATH || "/home/ubuntu/upload/isrgrootx1.pem";

if (!url) throw new Error("TIDB_DATABASE_URL is required");

const parsed = new URL(url);
const connection = await mysql.createConnection({
  host: parsed.hostname,
  port: Number(parsed.port || 3306),
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.replace(/^\//, "") || undefined,
  ssl: { ca: await readFile(caPath), rejectUnauthorized: true },
  connectTimeout: 10_000,
});

try {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      openId VARCHAR(64) NOT NULL UNIQUE,
      name TEXT,
      email VARCHAR(320),
      loginMethod VARCHAR(64),
      role ENUM('user', 'admin', 'cliente', 'locador') NOT NULL DEFAULT 'cliente',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS tableCount
     FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = 'users'`,
  );
  console.log(JSON.stringify({ migrated: true, usersTable: rows }));
} finally {
  await connection.end();
}
