CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_login VARCHAR(100),
    action VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_login VARCHAR,
    p_action VARCHAR,
    p_status VARCHAR,
    p_details TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (user_login, action, status, details)
    VALUES (p_user_login, p_action, p_status, p_details);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION audit_clients_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_login, action, status, details)
        VALUES (current_user, 'insert_client', 'success', 
                'Nouveau client: ' || NEW.nom || ' ' || NEW.prenom || ' (ID:' || NEW.id_client || ')');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_login, action, status, details)
        VALUES (current_user, 'update_client', 'success',
                'Client modifie ID: ' || NEW.id_client);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_login, action, status, details)
        VALUES (current_user, 'delete_client', 'success',
                'Client supprime ID: ' || OLD.id_client);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clients_audit_trigger ON clients;
CREATE TRIGGER clients_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON clients
FOR EACH ROW
EXECUTE FUNCTION audit_clients_changes();

CREATE OR REPLACE FUNCTION audit_comptes_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_login, action, status, details)
        VALUES (current_user, 'insert_compte', 'success',
                'Nouveau compte: ' || NEW.numero_compte || ' (ID:' || NEW.id_compte || ')');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_login, action, status, details)
        VALUES (current_user, 'update_compte', 'success',
                'Compte modifie ID: ' || NEW.id_compte);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_login, action, status, details)
        VALUES (current_user, 'delete_compte', 'success',
                'Compte supprime ID: ' || OLD.id_compte);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS comptes_audit_trigger ON comptes;
CREATE TRIGGER comptes_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON comptes
FOR EACH ROW
EXECUTE FUNCTION audit_comptes_changes();

INSERT INTO audit_logs (user_login, action, status) VALUES ('admin', 'login_attempt', 'success');
INSERT INTO audit_logs (user_login, action, status) VALUES ('injection_test', 'sql_injection', 'blocked');
