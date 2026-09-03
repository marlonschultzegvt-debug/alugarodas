import { describe, expect, it } from "vitest";
import mysql from "mysql2/promise";

const describeTiDB = process.env.RUN_TIDB_INTEGRATION_TESTS === "true" ? describe : describe.skip;

describeTiDB("TiDB external connection", () => {
  it("connects with the configured staging secret and executes a read-only probe", async () => {
    const url = process.env.TIDB_DATABASE_URL;

    if (!url) {
      throw new Error("TIDB_DATABASE_URL is required for this connection test");
    }

    const parsed = new URL(url);
    const connection = await mysql.createConnection({
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, "") || undefined,
      ssl: { rejectUnauthorized: true },
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
