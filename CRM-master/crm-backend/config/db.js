const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const hasMySqlEnv = Boolean(
  process.env.DB_HOST || process.env.DB_NAME || process.env.DB_USER || process.env.DB_PASSWORD
);

// DB_DIALECT env var always wins if set. Otherwise: use MySQL if MySQL
// env vars are present, else fall back to SQLite (a local file - no
// separate database server needed at all).
const dialect = process.env.DB_DIALECT
  ? process.env.DB_DIALECT
  : hasMySqlEnv
  ? "mysql"
  : "sqlite";

const useSQLite = dialect === "sqlite";

// Determine safe storage directory: Vercel serverless requires writing to /tmp
const isVercel = process.env.VERCEL || process.env.NODE_ENV === "production";
const storageDir = isVercel
  ? path.join("/tmp", "data")
  : path.join(__dirname, "..", "data");

const storagePath = path.join(storageDir, "crm.sqlite");

if (useSQLite) {
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });
  console.log(`Using SQLite - file at: ${storagePath}`);
} else {
  console.log(`Using MySQL - ${process.env.DB_HOST}:${process.env.DB_PORT}`);
}

const sequelize = new Sequelize(
  process.env.DB_NAME || "crm_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect,
    dialectModule: useSQLite ? undefined : require("mysql2"),
    storage: useSQLite ? storagePath : undefined,
    logging: false,
    define: {
      engine: "InnoDB",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  }
);

module.exports = sequelize;