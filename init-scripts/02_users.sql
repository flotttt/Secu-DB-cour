-- Creation de l utilisateur admin pour la gestion technique
CREATE USER admin WITH PASSWORD 'AdminSecure2024!' INHERIT LOGIN;

-- Creation de l utilisateur app_user pour l application
CREATE USER app_user WITH PASSWORD 'AppUserSecure2024!' INHERIT LOGIN;
