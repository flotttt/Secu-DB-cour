# Rapport - Securisation Base de Donnees Bancaire


## Architecture

- PostgreSQL 16 (Docker) - port 5432
- pgAdmin4 - port 5050
- Base : `banque`
- Frontend : Next.js 16 (TypeScript)

## 1. Creation de la base

Script : `init-scripts/01_init.sql`

Tables `clients`, `comptes` et `utilisateurs` avec donnees de test.

```sql
CREATE TABLE IF NOT EXISTS clients (
    id_client SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    date_naissance DATE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comptes (
    id_compte SERIAL PRIMARY KEY,
    id_client INTEGER NOT NULL REFERENCES clients(id_client) ON DELETE CASCADE,
    numero_compte VARCHAR(50) UNIQUE NOT NULL,
    type_compte VARCHAR(50) NOT NULL,
    solde DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    date_ouverture TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);

CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);
```

## 2. Utilisateurs DB

Script : `init-scripts/02_users.sql`

```sql
CREATE USER admin WITH PASSWORD 'AdminSecure2024!' INHERIT LOGIN;
CREATE USER app_user WITH PASSWORD 'AppUserSecure2024!' INHERIT LOGIN;
```

## 3. GRANT / REVOKE

Script : `init-scripts/03_rbac.sql`

```sql
REVOKE ALL ON TABLE clients FROM PUBLIC;
REVOKE ALL ON TABLE comptes FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO directeur, conseiller, analyste;
```

## 4. RBAC

Script : `init-scripts/03_rbac.sql`

Roles metiers :

```sql
CREATE ROLE directeur NOLOGIN INHERIT;
CREATE ROLE conseiller NOLOGIN INHERIT;
CREATE ROLE analyste NOLOGIN INHERIT;
```

Privileges :

**Directeur** (SELECT, INSERT, UPDATE, DELETE)
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE clients TO directeur;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE comptes TO directeur;
GRANT USAGE ON SEQUENCE clients_id_client_seq TO directeur;
GRANT USAGE ON SEQUENCE comptes_id_compte_seq TO directeur;
```

**Conseiller** (SELECT, INSERT, UPDATE)
```sql
GRANT SELECT, INSERT, UPDATE ON TABLE clients TO conseiller;
GRANT SELECT, INSERT, UPDATE ON TABLE comptes TO conseiller;
GRANT USAGE ON SEQUENCE clients_id_client_seq TO conseiller;
GRANT USAGE ON SEQUENCE comptes_id_compte_seq TO conseiller;
```

**Analyste** (SELECT uniquement)
```sql
GRANT SELECT ON TABLE clients TO analyste;
GRANT SELECT ON TABLE comptes TO analyste;
```

Association :
```sql
GRANT directeur TO admin;
GRANT conseiller TO app_user;

CREATE USER analyste_user WITH PASSWORD 'AnalysteSecure2024!' INHERIT LOGIN;
GRANT analyste TO analyste_user;
```

## 5. Securite Applicative

### 5.1 Requetes preparees

Script : `frontend/src/app/api/login/route.ts`

On passe de la concatenation SQL a des parametres `$1` :

```typescript
// Avant (vulnerable)
const query = `SELECT * FROM utilisateurs WHERE username = '${username}' AND password = '${password}'`;

// Apres (securise)
const result = await pool.query(
  'SELECT * FROM utilisateurs WHERE username = $1',
  [username]
);
```

La route vulnerable reste dispo pour la demo : `/api/login-vulnerable`

### 5.2 Hachage Bcrypt

Migration : `scripts/migrate-passwords.ts`

```bash
npx tsx scripts/migrate-passwords.ts
```

Verification :
```typescript
const validPassword = await bcrypt.compare(password, user.password);
```

## 6. Audit Logging

Script : `init-scripts/04_audit.sql`

Table `audit_logs` avec triggers sur `clients` et `comptes`.

Fonction `log_audit_event` appelee depuis l'app :
```sql
SELECT log_audit_event('admin', 'login_attempt', 'success');
```

Insertion de test :
```bash
npx tsx scripts/seed-audit.ts
```

## 7. Moindre Privilege (audit_user)

Script : `init-scripts/05_audit_user.sql`

```sql
CREATE USER audit_user WITH PASSWORD 'AuditSecure2024!' INHERIT LOGIN;
GRANT USAGE ON SCHEMA public TO audit_user;
GRANT SELECT ON audit_logs TO audit_user;
REVOKE ALL ON TABLE clients FROM audit_user;
REVOKE ALL ON TABLE comptes FROM audit_user;
REVOKE ALL ON TABLE utilisateurs FROM audit_user;
```

## 8. Backup

Script : `scripts/backup.ts`

```bash
npx tsx scripts/backup.ts
```

Le fichier est genere dans `backups/` avec un timestamp.

## 9. Livrables

Utilisation :
```bash
npx tsx scripts/injectionsql.ts
npx tsx scripts/test_securite.ts
npx tsx scripts/audit.ts
npx tsx scripts/backup.ts
npx tsx scripts/seed-audit.ts
npx tsx scripts/migrate-passwords.ts
```


## 11. Commandes

```bash
# Lancer
docker-compose up -d

# Arreter
docker-compose down

# Reconstruire (supprime les donnees)
docker-compose down -v && docker-compose up -d

# Connexion admin
docker exec -it postgres-banque psql -U postgres_admin -d banque

# Connexion audit_user
docker exec -it postgres-banque psql -U audit_user -d banque

# Script SQL manuel
docker exec -i postgres-banque psql -U postgres_admin -d banque < init-scripts/04_audit.sql

# Logs PostgreSQL
docker logs postgres-banque
```

http://localhost:3000/
