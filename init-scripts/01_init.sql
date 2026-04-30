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

INSERT INTO clients (nom, prenom, email, telephone, adresse, date_naissance) VALUES
('Martin', 'Sophie', 'sophie.martin@email.fr', '0612345678', '12 Rue de la Paix, Paris', '1985-03-15'),
('Bernard', 'Lucas', 'lucas.bernard@email.fr', '0623456789', '45 Avenue des Champs, Lyon', '1990-07-22'),
('Petit', 'Emma', 'emma.petit@email.fr', '0634567890', '78 Boulevard Haussmann, Marseille', '1978-11-05');

CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

INSERT INTO utilisateurs (username, password, role) VALUES
('admin', 'admin123', 'admin'),
('sophie.martin', 'pass123', 'user'),
('lucas.bernard', 'pass456', 'user');

INSERT INTO comptes (id_client, numero_compte, type_compte, solde, statut) VALUES
(1, 'FR761234567890000000000001', 'courant', 1500.50, 'actif'),
(1, 'FR761234567890000000000002', 'epargne', 5000.00, 'actif'),
(2, 'FR761234567890000000000003', 'courant', 230.75, 'actif'),
(3, 'FR761234567890000000000004', 'courant', 12000.00, 'actif'),
(3, 'FR761234567890000000000005', 'epargne', 25000.00, 'actif');
