import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import { describe, expect, it } from "vitest";

describe("TiDB CA certificate", () => {
  it("connects with the supplied CA and runs a read-only probe", async () => {
    const url = process.env.TIDB_DATABASE_URL;
    const caPath = process.env.TIDB_CA_PATH || "/home/ubuntu/upload/isrgrootx1.pem";

    if (!url) throw new Error("TIDB_DATABASE_URL is required");

    const parsed = new URL(url);
    const ca = await readFile(caPath);
    const connection = await mysql.createConnection({
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, "") || undefined,
      ssl: { ca, rejectUnauthorized: true },
      connectTimeout: 10_000,
    });

    try {
      const [rows] = await connection.query("SELECT 1 AS connected");
      expect(rows).toEqual([{ connected: 1 }]);
    } finally {
      await connection.end();
    }
  }, 20_000);
});
