# Rapport - Securisation Base de Donnees Bancaire

## TP1

## TP2 sur la branch TP2

## Instalation du projet 


```bash
docker-compose up -d
```
et aller sur l'adresse http://localhost:3000/

## Contexte
Application bancaire connectee a une base de donnees PostgreSQL. Gestion des donnees clients et comptes avec protection contre les acces non autorises.

## Objectif
Securiser la base de donnees en mettant en place :
- Une gestion correcte des utilisateurs
- Des droits d'acces controles (GRANT / REVOKE)
- Une architecture RBAC (Role-Based Access Control)
- Le principe du moindre privilege

---

## Architecture
- **SGBD** : PostgreSQL 16 (Docker)
- **Administration** : pgAdmin4 (port 5050)
- **Port DB** : 5432
- **Base** : `banque`

---

## 1. Creation de la base

Script : `init-scripts/01_init.sql`

Creation des tables `clients` et `comptes` avec insertion de donnees de test.

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

---

## 2. Gestion des utilisateurs

Script : `init-scripts/02_users.sql`

Creation de deux utilisateurs dedies sans attribut superuser.

```sql
CREATE USER admin WITH PASSWORD 'AdminSecure2024!' INHERIT LOGIN;

CREATE USER app_user WITH PASSWORD 'AppUserSecure2024!' INHERIT LOGIN;
```

---

## 3. Securite des acces (GRANT / REVOKE)

Script : `init-scripts/03_rbac.sql`

Retrait des droits par defaut puis attribution ciblee selon le moindre privilege.

```sql
REVOKE ALL ON TABLE clients FROM PUBLIC;
REVOKE ALL ON TABLE comptes FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO directeur, conseiller, analyste;
```

---

## 4. RBAC - Gestion des roles

Script : `init-scripts/03_rbac.sql` (suite)

### 4.1 Creation des roles metiers

```sql
CREATE ROLE directeur NOLOGIN INHERIT;

CREATE ROLE conseiller NOLOGIN INHERIT;

CREATE ROLE analyste NOLOGIN INHERIT;
```

### 4.2 Attribution des privileges par role

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

### 4.3 Association utilisateurs / roles

```sql
GRANT directeur TO admin;

GRANT conseiller TO app_user;


CREATE USER analyste_user WITH PASSWORD 'AnalysteSecure2024!' INHERIT LOGIN;
GRANT analyste TO analyste_user;
```
