import mysql from "mysql2/promise";
import { describe, expect, it } from "vitest";

const describeTiDB = process.env.RUN_TIDB_INTEGRATION_TESTS === "true" ? describe : describe.skip;

describeTiDB("TiDB staging schema", () => {
  it("reports whether the users table exists without changing data", async () => {
    const url = process.env.TIDB_DATABASE_URL;
    if (!url) throw new Error("TIDB_DATABASE_URL is required");

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
      const [rows] = await connection.query(
        `SELECT COUNT(*) AS tableCount
         FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = 'users'`,
      );
      expect(rows).toHaveLength(1);
      const tableCount = Number((rows as Array<{ tableCount: number | string }>)[0]?.tableCount ?? 0);
      expect([0, 1]).toContain(tableCount);
      console.info(`[TiDB staging] users table present: ${tableCount === 1}`);
      return rows;
    } finally {
      await connection.end();
    }
  }, 20_000);
});
