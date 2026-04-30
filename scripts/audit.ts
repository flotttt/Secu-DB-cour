import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "banque",
  user: process.env.DB_USER || "postgres_admin",
  password: process.env.DB_PASSWORD || "SecureBanque2024!",
});

async function visualiserAudit() {
  try {
    const result = await pool.query(
      `SELECT id, user_login, action, status, details, created_at
       FROM audit_logs 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    if (result.rows.length === 0) {
      console.log("Aucun log d'audit trouve");
      return;
    }

    console.log(`${result.rows.length} evenements d'audit`);
    console.log("-".repeat(100));
    console.log(
      `${"ID".padEnd(5)} | ${"UTILISATEUR".padEnd(18)} | ${"ACTION".padEnd(20)} | ${"STATUT".padEnd(12)} | ${"DATE".padEnd(20)} | DETAILS`
    );
    console.log("-".repeat(100));

    for (const log of result.rows) {
      const date = new Date(log.created_at).toLocaleString("fr-FR");
      const details = log.details ? log.details.substring(0, 30) : "";
      console.log(
        `${String(log.id).padEnd(5)} | ${(log.user_login || "N/A").padEnd(18)} | ${log.action.padEnd(20)} | ${log.status.padEnd(12)} | ${date.padEnd(20)} | ${details}`
      );
    }

    console.log("-".repeat(100));

    const statsResult = await pool.query(`
      SELECT action, status, COUNT(*) as count
      FROM audit_logs
      GROUP BY action, status
      ORDER BY count DESC
    `);

    console.log("\nStatistiques:");
    for (const stat of statsResult.rows) {
      console.log(`${stat.action} (${stat.status}) : ${stat.count}`);
    }

  } catch (error) {
    console.error("Erreur:", (error as Error).message);
  } finally {
    await pool.end();
  }
}

visualiserAudit();
