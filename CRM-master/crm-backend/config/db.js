const { Sequelize } = require("sequelize");
require("dotenv").config();

// Determine database dialect and connection strategy
const dialect = process.env.DB_DIALECT || (process.env.DATABASE_URL ? "postgres" : "sqlite");

let sequelize;

if (dialect === "postgres" || process.env.DATABASE_URL) {
  // Supabase / PostgreSQL Setup
  const dbUrl = process.env.DATABASE_URL || 
    "postgresql://postgres.txvxlblnrztzmtouxvbv:U%40%26-KkB9%40wu%3FAQ6@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

  sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    dialectModule: require("pg"),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Supabase cloud SSL connection
      }
    },
    logging: false
  });
  
  console.log("Connected to Supabase PostgreSQL database");

} else {
  // Local fallback (MySQL / SQLite)
  const hasMySqlEnv = Boolean(
    process.env.DB_HOST || process.env.DB_NAME || process.env.DB_USER || process.env.DB_PASSWORD
  );
  
  const activeDialect = process.env.DB_DIALECT || (hasMySqlEnv ? "mysql" : "sqlite");
  
  sequelize = new Sequelize(
    process.env.DB_NAME || "crm_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 3306,
      dialect: activeDialect,
      dialectModule: activeDialect === "mysql" ? require("mysql2") : undefined,
      logging: false,
      define: {
        engine: "InnoDB",
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      },
    }
  );
}

module.exports = sequelize;