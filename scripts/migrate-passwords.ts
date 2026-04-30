import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "banque",
  user: process.env.DB_USER || "postgres_admin",
  password: process.env.DB_PASSWORD || "SecureBanque2024!",
});

async function migratePasswords() {
  try {
    const result = await pool.query("SELECT * FROM utilisateurs");
    console.log(`Utilisateurs: ${result.rows.length}`);

    for (const user of result.rows) {
      if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
        console.log(`${user.username}: deja hashe`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await pool.query(
        "UPDATE utilisateurs SET password = $1 WHERE id_utilisateur = $2",
        [hashedPassword, user.id_utilisateur]
      );

      console.log(`${user.username}: hash ok`);
    }

    console.log("Migration terminee");

  } catch (error) {
    console.error("Erreur:", (error as Error).message);
  } finally {
    await pool.end();
  }
}

migratePasswords();
