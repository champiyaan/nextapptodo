import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized:
      process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" ? false : true,
  },
});

export default pool;
