import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(__dirname, "..", "backups");
  const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const dbName = process.env.DB_NAME || "banque";
  const dbUser = process.env.DB_USER || "postgres_admin";

  console.log("Generation du backup");
  console.log("Base:", dbName);
  console.log("Fichier:", backupFile);

  try {
    const command = `docker exec postgres-banque pg_dump -U ${dbUser} -d ${dbName} --clean --if-exists > "${backupFile}"`;
    await execAsync(command);

    const stats = fs.statSync(backupFile);
    const sizeKo = (stats.size / 1024).toFixed(2);

    console.log("Backup cree:", backupFile);
    console.log("Taille:", sizeKo, "KB");

    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith("backup_") && f.endsWith(".sql"))
      .sort()
      .reverse();

    console.log(`Backups disponibles: ${files.length}`);
    for (const file of files.slice(0, 5)) {
      const fileStats = fs.statSync(path.join(backupDir, file));
      console.log(`  - ${file} (${(fileStats.size / 1024).toFixed(2)} KB)`);
    }

  } catch (error) {
    console.error("Erreur backup:", (error as Error).message);
  }
}

createBackup();
