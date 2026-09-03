import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL não está configurada no ambiente.");
}

const connection = await mysql.createConnection(databaseUrl);

try {
  await connection.query(
    "CREATE DATABASE IF NOT EXISTS `alugarodas` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
  );
  console.log("Banco de aplicação alugarodas pronto.");
} finally {
  await connection.end();
}
