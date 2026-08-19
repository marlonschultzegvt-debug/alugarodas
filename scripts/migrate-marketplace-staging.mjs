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
  multipleStatements: false,
});

try {
  const sql = await readFile("drizzle/0001_mushy_pyro.sql", "utf8");
  const statements = sql
    .split(/--> statement-breakpoint/g)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await connection.query(statement);
  }

  const [rows] = await connection.query(
    `SELECT table_name AS tableName
     FROM information_schema.tables
     WHERE table_schema = DATABASE()
       AND table_name IN ('users', 'companies', 'vehicles', 'vehicle_images', 'leads')
     ORDER BY table_name`,
  );
  console.log(JSON.stringify({ applied: statements.length, tables: rows }));
} finally {
  await connection.end();
}
