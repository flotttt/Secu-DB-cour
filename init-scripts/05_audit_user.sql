CREATE USER audit_user WITH PASSWORD 'AuditSecure2024!' INHERIT LOGIN;

GRANT USAGE ON SCHEMA public TO audit_user;
GRANT SELECT ON audit_logs TO audit_user;

REVOKE ALL ON TABLE clients FROM audit_user;
REVOKE ALL ON TABLE comptes FROM audit_user;
REVOKE ALL ON TABLE utilisateurs FROM audit_user;
