// db.ts
import sql from 'mssql';

// lib/db.ts
const config = {
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    server: process.env.DB_SERVER!,
    database: process.env.DB_DATABASE!,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  };
  

// Khai báo biến global với kiểu any
const globalAny: any = global;

export async function getConnection() {
  if (!globalAny.connectionPool) {
    globalAny.connectionPool = await sql.connect(config);
  }
  return globalAny.connectionPool;
}
