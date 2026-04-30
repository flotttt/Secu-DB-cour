import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "banque",
  user: process.env.DB_USER || "postgres_admin",
  password: process.env.DB_PASSWORD || "SecureBanque2024!",
});

async function seedAuditLogs() {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_login, action, status) 
       VALUES ('admin', 'login_attempt', 'success')`
    );
    console.log("admin - login_attempt - success");

    await pool.query(
      `INSERT INTO audit_logs (user_login, action, status) 
       VALUES ('injection_test', 'sql_injection', 'blocked')`
    );
    console.log("injection_test - sql_injection - blocked");

    await pool.query(
      `INSERT INTO audit_logs (user_login, action, status, details) 
       VALUES ('hacker', 'sql_injection', 'blocked', 'Tentative OR 1=1')`
    );
    console.log("hacker - sql_injection - blocked");

    await pool.query(
      `INSERT INTO audit_logs (user_login, action, status) 
       VALUES ('sophie.martin', 'login_attempt', 'success')`
    );
    console.log("sophie.martin - login_attempt - success");

    await pool.query(
      `INSERT INTO audit_logs (user_login, action, status) 
       VALUES ('unknown', 'login_attempt', 'failed')`
    );
    console.log("unknown - login_attempt - failed");

    console.log("Donnees de test inserees");

  } catch (error) {
    console.error("Erreur:", (error as Error).message);
  } finally {
    await pool.end();
  }
}

seedAuditLogs();
