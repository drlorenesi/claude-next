// Helpful MySQL commands to check server connections:
// SHOW STATUS WHERE Variable_name = 'Threads_connected';
// SHOW FULL PROCESSLIST;
// SELECT CONNECTION_ID() AS id;
// SHOW STATUS LIKE '%connect%';
// SHOW VARIABLES LIKE 'max_connections';

// Get the client
import mysql, { PoolOptions } from "mysql2/promise"

// Extend the global type to include our custom property
declare global {
  var _mysqlPool: mysql.Pool | undefined
}

const isDev = process.env.NODE_ENV === "development"

const access: PoolOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_PORT) || 3306,
  timezone: "Z", // keep timestamps consistent
  waitForConnections: true,
  connectionLimit: isDev ? 3 : 10,
  maxIdle: isDev ? 3 : 10, // keep in sync with connectionLimit
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 100, // cap queued requests to avoid unbounded memory growth if the DB is unavailable
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl:
    process.env.MYSQL_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
}

function createManagedPool(): mysql.Pool {
  const p = mysql.createPool(access)

  const closePool = async () => {
    try {
      await p.end()
      console.log("Database pool closed successfully")
    } catch (error) {
      console.error("Error closing database pool:", error)
    }
  }

  // Handle shutdown signals sent by process managers
  // (like PM2, Docker, Kubernetes) for graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, closing database pool...")
    await closePool()
    process.exit(0)
  })

  // Handle Ctrl+C
  process.on("SIGINT", async () => {
    console.log("SIGINT received, closing database pool...")
    await closePool()
    process.exit(0)
  })

  return p
}

export let pool: mysql.Pool

if (isDev) {
  // Reuse the existing pool across HMR reloads to avoid exhausting connections
  if (!global._mysqlPool) global._mysqlPool = createManagedPool()
  pool = global._mysqlPool
} else {
  pool = createManagedPool()
}
