-- Creation des roles metiers avec le principe du moindre privilege
CREATE ROLE directeur NOLOGIN INHERIT;
CREATE ROLE conseiller NOLOGIN INHERIT;
CREATE ROLE analyste NOLOGIN INHERIT;

-- Retrait des droits par defaut pour appliquer le moindre privilege
REVOKE ALL ON TABLE clients FROM PUBLIC;
REVOKE ALL ON TABLE comptes FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Acces au schema public
GRANT USAGE ON SCHEMA public TO directeur, conseiller, analyste;

-- Directeur : acces complet sur clients et comptes
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE clients TO directeur;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE comptes TO directeur;
GRANT USAGE ON SEQUENCE clients_id_client_seq TO directeur;
GRANT USAGE ON SEQUENCE comptes_id_compte_seq TO directeur;

-- Conseiller : acces limite (pas de suppression)
GRANT SELECT, INSERT, UPDATE ON TABLE clients TO conseiller;
GRANT SELECT, INSERT, UPDATE ON TABLE comptes TO conseiller;
GRANT USAGE ON SEQUENCE clients_id_client_seq TO conseiller;
GRANT USAGE ON SEQUENCE comptes_id_compte_seq TO conseiller;

-- Analyste : lecture seule
GRANT SELECT ON TABLE clients TO analyste;
GRANT SELECT ON TABLE comptes TO analyste;

-- Association des utilisateurs aux roles
GRANT directeur TO admin;
GRANT conseiller TO app_user;

-- Creation d un utilisateur dedie pour le role analyste
CREATE USER analyste_user WITH PASSWORD 'AnalysteSecure2024!' INHERIT LOGIN;
GRANT analyste TO analyste_user;
