import mysql from "mysql2/promise";
import { describe, expect, it } from "vitest";

const describeTiDB = process.env.RUN_TIDB_INTEGRATION_TESTS === "true" ? describe : describe.skip;

describeTiDB("TiDB marketplace schema", () => {
  it("has marketplace tables and expected foreign keys without requiring seed data", async () => {
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
      const [tables] = await connection.query(
        `SELECT table_name AS tableName
         FROM information_schema.tables
         WHERE table_schema = DATABASE()
           AND table_name IN ('users', 'companies', 'vehicles', 'vehicle_images', 'leads')
         ORDER BY table_name`,
      );
      expect((tables as Array<{ tableName: string }>).map((row) => row.tableName)).toEqual([
        "companies",
        "leads",
        "users",
        "vehicle_images",
        "vehicles",
      ]);

      const [foreignKeys] = await connection.query(
        `SELECT COUNT(*) AS foreignKeyCount
         FROM information_schema.table_constraints
         WHERE constraint_schema = DATABASE() AND constraint_type = 'FOREIGN KEY'`,
      );
      expect(Number((foreignKeys as Array<{ foreignKeyCount: number | string }>)[0]?.foreignKeyCount ?? 0)).toBe(6);

      const [indexes] = await connection.query(
        `SELECT DISTINCT table_name AS tableName, index_name AS indexName
         FROM information_schema.statistics
         WHERE table_schema = DATABASE()
           AND index_name IN (
             'companies_owner_idx', 'leads_vehicle_idx', 'leads_company_status_idx',
             'leads_created_idx', 'vehicle_images_vehicle_idx', 'vehicles_company_idx',
             'vehicles_location_idx', 'vehicles_category_status_idx'
           )
         ORDER BY table_name, index_name`,
      );
      expect((indexes as Array<{ tableName: string; indexName: string }>).map((row) => row.indexName)).toEqual([
        "companies_owner_idx",
        "leads_company_status_idx",
        "leads_created_idx",
        "leads_vehicle_idx",
        "vehicle_images_vehicle_idx",
        "vehicles_category_status_idx",
        "vehicles_company_idx",
        "vehicles_location_idx",
      ]);

      const [counts] = await connection.query(
        `SELECT
           (SELECT COUNT(*) FROM companies) AS companiesCount,
           (SELECT COUNT(*) FROM vehicles) AS vehiclesCount,
           (SELECT COUNT(*) FROM vehicle_images) AS imagesCount,
           (SELECT COUNT(*) FROM leads) AS leadsCount`,
      );
      expect(counts).toHaveLength(1);
      console.info("[TiDB staging] marketplace schema, relationships and indexes validated", counts);
    } finally {
      await connection.end();
    }
  }, 20_000);
});
