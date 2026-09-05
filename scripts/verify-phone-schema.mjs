import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL não foi definida nesta sessão.");
  process.exit(1);
}

const connection = await mysql.createConnection(databaseUrl);

try {
  const [databaseRows] = await connection.query("SELECT DATABASE() AS database_name");
  const [phoneRows] = await connection.query("SHOW COLUMNS FROM users LIKE 'phone'");
  const databaseName = databaseRows[0]?.database_name ?? "desconhecido";

  console.log(`Banco conectado: ${databaseName}`);
  console.log(phoneRows.length ? "Coluna users.phone: encontrada" : "Coluna users.phone: AUSENTE");

  if (databaseName !== "alugarodas" || phoneRows.length === 0) {
    process.exitCode = 2;
  }
} finally {
  await connection.end();
}
