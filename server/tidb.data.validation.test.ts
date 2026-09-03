import mysql from "mysql2/promise";
import { describe, expect, it } from "vitest";

const describeTiDB = process.env.RUN_TIDB_INTEGRATION_TESTS === "true" ? describe : describe.skip;

describeTiDB("TiDB staging data validation", () => {
  it("matches the auth schema and contains no unintended imported users", async () => {
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
      const [columns] = await connection.query(
        `SELECT COLUMN_NAME AS columnName
         FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = 'users'
         ORDER BY ORDINAL_POSITION`,
      );
      const names = (columns as Array<{ columnName: string }>).map((row) => row.columnName);
      expect(names).toEqual([
        "id",
        "openId",
        "name",
        "email",
        "loginMethod",
        "role",
        "createdAt",
        "updatedAt",
        "lastSignedIn",
      ]);

      const [users] = await connection.query("SELECT COUNT(*) AS userCount FROM users");
      const userCount = Number((users as Array<{ userCount: number | string }>)[0]?.userCount ?? 0);
      expect(userCount).toBe(0);
      console.info(`[TiDB staging] auth columns valid; user rows: ${userCount}`);
    } finally {
      await connection.end();
    }
  }, 20_000);
});
