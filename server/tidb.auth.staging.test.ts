import mysql from "mysql2/promise";
import { describe, expect, it } from "vitest";

describe("TiDB staging auth persistence", () => {
  it("can write and read an auth-shaped user inside a rolled-back transaction", async () => {
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

    const openId = `staging-auth-probe-${Date.now()}`;
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO users (openId, name, email, loginMethod, role)
         VALUES (?, ?, ?, ?, ?)`,
        [openId, "Staging Probe", "staging-probe@example.invalid", "test", "cliente"],
      );
      const [rows] = await connection.execute(
        "SELECT openId, role FROM users WHERE openId = ? LIMIT 1",
        [openId],
      );
      expect(rows).toEqual([{ openId, role: "cliente" }]);
      await connection.rollback();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  }, 20_000);
});
