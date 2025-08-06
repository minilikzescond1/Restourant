import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "restaurant_db",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig)
  }
  return connection
}

export async function query(sql: string, params?: any[]) {
  const conn = await getConnection()
  const [results] = await conn.execute(sql, params)
  return results
}
