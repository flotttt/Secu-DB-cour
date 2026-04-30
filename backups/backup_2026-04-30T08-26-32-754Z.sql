--
-- PostgreSQL database dump
--

\restrict 2SIiPTrQu2PMHSPhuiY80e7aTKD6ezYuG2t9sMQWBJxkfO27MjeIM5SZloWu04a

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.comptes DROP CONSTRAINT IF EXISTS comptes_id_client_fkey;
DROP TRIGGER IF EXISTS comptes_audit_trigger ON public.comptes;
DROP TRIGGER IF EXISTS clients_audit_trigger ON public.clients;
ALTER TABLE IF EXISTS ONLY public.utilisateurs DROP CONSTRAINT IF EXISTS utilisateurs_username_key;
ALTER TABLE IF EXISTS ONLY public.utilisateurs DROP CONSTRAINT IF EXISTS utilisateurs_pkey;
ALTER TABLE IF EXISTS ONLY public.comptes DROP CONSTRAINT IF EXISTS comptes_pkey;
ALTER TABLE IF EXISTS ONLY public.comptes DROP CONSTRAINT IF EXISTS comptes_numero_compte_key;
ALTER TABLE IF EXISTS ONLY public.clients DROP CONSTRAINT IF EXISTS clients_pkey;
ALTER TABLE IF EXISTS ONLY public.clients DROP CONSTRAINT IF EXISTS clients_email_key;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS public.utilisateurs ALTER COLUMN id_utilisateur DROP DEFAULT;
ALTER TABLE IF EXISTS public.comptes ALTER COLUMN id_compte DROP DEFAULT;
ALTER TABLE IF EXISTS public.clients ALTER COLUMN id_client DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_logs ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.utilisateurs_id_utilisateur_seq;
DROP TABLE IF EXISTS public.utilisateurs;
DROP SEQUENCE IF EXISTS public.comptes_id_compte_seq;
DROP TABLE IF EXISTS public.comptes;
DROP SEQUENCE IF EXISTS public.clients_id_client_seq;
DROP TABLE IF EXISTS public.clients;
DROP SEQUENCE IF EXISTS public.audit_logs_id_seq;
DROP TABLE IF EXISTS public.audit_logs;
DROP FUNCTION IF EXISTS public.log_audit_event(p_user_login character varying, p_action character varying, p_status character varying, p_details text);
DROP FUNCTION IF EXISTS public.audit_comptes_changes();
DROP FUNCTION IF EXISTS public.audit_clients_changes();
--
-- Name: audit_clients_changes(); Type: FUNCTION; Schema: public; Owner: postgres_admin
--

CREATE FUNCTION public.audit_clients_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.audit_clients_changes() OWNER TO postgres_admin;

--
-- Name: audit_comptes_changes(); Type: FUNCTION; Schema: public; Owner: postgres_admin
--

CREATE FUNCTION public.audit_comptes_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.audit_comptes_changes() OWNER TO postgres_admin;

--
-- Name: log_audit_event(character varying, character varying, character varying, text); Type: FUNCTION; Schema: public; Owner: postgres_admin
--

CREATE FUNCTION public.log_audit_event(p_user_login character varying, p_action character varying, p_status character varying, p_details text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO audit_logs (user_login, action, status, details)
    VALUES (p_user_login, p_action, p_status, p_details);
END;
$$;


ALTER FUNCTION public.log_audit_event(p_user_login character varying, p_action character varying, p_status character varying, p_details text) OWNER TO postgres_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres_admin
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_login character varying(100),
    action character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    details text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres_admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres_admin
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres_admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres_admin
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres_admin
--

CREATE TABLE public.clients (
    id_client integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    telephone character varying(20),
    adresse text,
    date_naissance date,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clients OWNER TO postgres_admin;

--
-- Name: clients_id_client_seq; Type: SEQUENCE; Schema: public; Owner: postgres_admin
--

CREATE SEQUENCE public.clients_id_client_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_client_seq OWNER TO postgres_admin;

--
-- Name: clients_id_client_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres_admin
--

ALTER SEQUENCE public.clients_id_client_seq OWNED BY public.clients.id_client;


--
-- Name: comptes; Type: TABLE; Schema: public; Owner: postgres_admin
--

CREATE TABLE public.comptes (
    id_compte integer NOT NULL,
    id_client integer NOT NULL,
    numero_compte character varying(50) NOT NULL,
    type_compte character varying(50) NOT NULL,
    solde numeric(15,2) DEFAULT 0.00 NOT NULL,
    date_ouverture timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying
);


ALTER TABLE public.comptes OWNER TO postgres_admin;

--
-- Name: comptes_id_compte_seq; Type: SEQUENCE; Schema: public; Owner: postgres_admin
--

CREATE SEQUENCE public.comptes_id_compte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comptes_id_compte_seq OWNER TO postgres_admin;

--
-- Name: comptes_id_compte_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres_admin
--

ALTER SEQUENCE public.comptes_id_compte_seq OWNED BY public.comptes.id_compte;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres_admin
--

CREATE TABLE public.utilisateurs (
    id_utilisateur integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying
);


ALTER TABLE public.utilisateurs OWNER TO postgres_admin;

--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE; Schema: public; Owner: postgres_admin
--

CREATE SEQUENCE public.utilisateurs_id_utilisateur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_utilisateur_seq OWNER TO postgres_admin;

--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres_admin
--

ALTER SEQUENCE public.utilisateurs_id_utilisateur_seq OWNED BY public.utilisateurs.id_utilisateur;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: clients id_client; Type: DEFAULT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.clients ALTER COLUMN id_client SET DEFAULT nextval('public.clients_id_client_seq'::regclass);


--
-- Name: comptes id_compte; Type: DEFAULT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.comptes ALTER COLUMN id_compte SET DEFAULT nextval('public.comptes_id_compte_seq'::regclass);


--
-- Name: utilisateurs id_utilisateur; Type: DEFAULT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id_utilisateur SET DEFAULT nextval('public.utilisateurs_id_utilisateur_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres_admin
--

COPY public.audit_logs (id, user_login, action, status, details, created_at) FROM stdin;
1	admin	login_attempt	success	\N	2026-04-30 08:19:06.466039
2	injection_test	sql_injection	blocked	\N	2026-04-30 08:19:06.469553
3	admin	login_attempt	success	\N	2026-04-30 08:19:48.540638
4	injection_test	sql_injection	blocked	\N	2026-04-30 08:19:48.551603
5	hacker	sql_injection	blocked	Tentative OR 1=1	2026-04-30 08:19:48.55796
6	sophie.martin	login_attempt	success	\N	2026-04-30 08:19:48.562975
7	unknown	login_attempt	failed	\N	2026-04-30 08:19:48.567252
8	admin	login_attempt	pending	\N	2026-04-30 08:24:11.983563
9	admin	login_attempt	success	\N	2026-04-30 08:24:12.086495
10	' OR '1'='1' --	login_attempt	pending	\N	2026-04-30 08:24:15.282766
11	' OR '1'='1' --	login_attempt	failed	\N	2026-04-30 08:24:15.292394
12	' OR '1'='1' --	login_attempt	pending	\N	2026-04-30 08:24:30.979625
13	' OR '1'='1' --	login_attempt	failed	\N	2026-04-30 08:24:30.992595
14	admin	login_attempt	pending	\N	2026-04-30 08:24:31.020138
15	admin	login_attempt	success	\N	2026-04-30 08:24:31.11472
16	admin	login_attempt	pending	\N	2026-04-30 08:24:31.138208
17	admin	login_attempt	failed	\N	2026-04-30 08:24:31.213256
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres_admin
--

COPY public.clients (id_client, nom, prenom, email, telephone, adresse, date_naissance, date_creation) FROM stdin;
1	Martin	Sophie	sophie.martin@email.fr	0612345678	12 Rue de la Paix, Paris	1985-03-15	2026-04-29 10:04:17.059835
2	Bernard	Lucas	lucas.bernard@email.fr	0623456789	45 Avenue des Champs, Lyon	1990-07-22	2026-04-29 10:04:17.059835
3	Petit	Emma	emma.petit@email.fr	0634567890	78 Boulevard Haussmann, Marseille	1978-11-05	2026-04-29 10:04:17.059835
\.


--
-- Data for Name: comptes; Type: TABLE DATA; Schema: public; Owner: postgres_admin
--

COPY public.comptes (id_compte, id_client, numero_compte, type_compte, solde, date_ouverture, statut) FROM stdin;
1	1	FR761234567890000000000001	courant	1500.50	2026-04-29 10:04:17.065	actif
2	1	FR761234567890000000000002	epargne	5000.00	2026-04-29 10:04:17.065	actif
3	2	FR761234567890000000000003	courant	230.75	2026-04-29 10:04:17.065	actif
4	3	FR761234567890000000000004	courant	12000.00	2026-04-29 10:04:17.065	actif
5	3	FR761234567890000000000005	epargne	25000.00	2026-04-29 10:04:17.065	actif
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres_admin
--

COPY public.utilisateurs (id_utilisateur, username, password, role) FROM stdin;
1	admin	$2b$10$4SHm.v2zW8k8RQjtVkOEMO6xPjtVkXNFEzgAVKMmS8OyJs.mpzRVO	admin
2	sophie.martin	$2b$10$eBs.E0HIyRIh9ytgmL9FweovgOfGJD75rcwLK4EnvpStlLk43WL.i	user
3	lucas.bernard	$2b$10$thTxTh8Z/ZyYSC/EoXKQ3uxboPciE0EJG1Re0sTcu.o9bvj1RqjJS	user
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_admin
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 17, true);


--
-- Name: clients_id_client_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_admin
--

SELECT pg_catalog.setval('public.clients_id_client_seq', 3, true);


--
-- Name: comptes_id_compte_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_admin
--

SELECT pg_catalog.setval('public.comptes_id_compte_seq', 5, true);


--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_admin
--

SELECT pg_catalog.setval('public.utilisateurs_id_utilisateur_seq', 3, true);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: clients clients_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key UNIQUE (email);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id_client);


--
-- Name: comptes comptes_numero_compte_key; Type: CONSTRAINT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.comptes
    ADD CONSTRAINT comptes_numero_compte_key UNIQUE (numero_compte);


--
-- Name: comptes comptes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.comptes
    ADD CONSTRAINT comptes_pkey PRIMARY KEY (id_compte);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id_utilisateur);


--
-- Name: utilisateurs utilisateurs_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_username_key UNIQUE (username);


--
-- Name: clients clients_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres_admin
--

CREATE TRIGGER clients_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.audit_clients_changes();


--
-- Name: comptes comptes_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres_admin
--

CREATE TRIGGER comptes_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.comptes FOR EACH ROW EXECUTE FUNCTION public.audit_comptes_changes();


--
-- Name: comptes comptes_id_client_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_admin
--

ALTER TABLE ONLY public.comptes
    ADD CONSTRAINT comptes_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.clients(id_client) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO directeur;
GRANT USAGE ON SCHEMA public TO conseiller;
GRANT USAGE ON SCHEMA public TO analyste;
GRANT USAGE ON SCHEMA public TO audit_user;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres_admin
--

GRANT SELECT ON TABLE public.audit_logs TO audit_user;


--
-- Name: TABLE clients; Type: ACL; Schema: public; Owner: postgres_admin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.clients TO directeur;
GRANT SELECT,INSERT,UPDATE ON TABLE public.clients TO conseiller;
GRANT SELECT ON TABLE public.clients TO analyste;


--
-- Name: SEQUENCE clients_id_client_seq; Type: ACL; Schema: public; Owner: postgres_admin
--

GRANT USAGE ON SEQUENCE public.clients_id_client_seq TO directeur;
GRANT USAGE ON SEQUENCE public.clients_id_client_seq TO conseiller;


--
-- Name: TABLE comptes; Type: ACL; Schema: public; Owner: postgres_admin
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.comptes TO directeur;
GRANT SELECT,INSERT,UPDATE ON TABLE public.comptes TO conseiller;
GRANT SELECT ON TABLE public.comptes TO analyste;


--
-- Name: SEQUENCE comptes_id_compte_seq; Type: ACL; Schema: public; Owner: postgres_admin
--

GRANT USAGE ON SEQUENCE public.comptes_id_compte_seq TO directeur;
GRANT USAGE ON SEQUENCE public.comptes_id_compte_seq TO conseiller;


--
-- PostgreSQL database dump complete
--

\unrestrict 2SIiPTrQu2PMHSPhuiY80e7aTKD6ezYuG2t9sMQWBJxkfO27MjeIM5SZloWu04a

