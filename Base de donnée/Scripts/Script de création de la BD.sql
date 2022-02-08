-- Généré par Oracle SQL Developer Data Modeler 21.2.0.165.1515
--   à :        2022-02-08 10:55:20 EST
--   site :      Oracle Database 11g
--   type :      Oracle Database 11g



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE categories (
    id_categories DECIMAL NOT NULL,
    nom           VARCHAR(50) NOT NULL,
    description   VARCHAR(100)
);

ALTER TABLE categories ADD CONSTRAINT categories_pk PRIMARY KEY ( id_categories );

CREATE TABLE compte_client (
    nom_utilisateur  VARCHAR(100) NOT NULL,
    mdp              VARCHAR(80) NOT NULL,
    prenom           VARCHAR(50) NOT NULL,
    nom              VARCHAR(50) NOT NULL,
    email            VARCHAR(100) NOT NULL,
    adresse          VARCHAR(100) NOT NULL,
    panier_id_panier DECIMAL NOT NULL
);

CREATE UNIQUE INDEX compte_client__idx ON
    compte_client (
        panier_id_panier
    ASC );

ALTER TABLE compte_client ADD CONSTRAINT compte_client_pk PRIMARY KEY ( nom_utilisateur );

CREATE TABLE compte_employe (
    nom_utilisateur VARCHAR(100) NOT NULL,
    mdp             VARCHAR(80) NOT NULL,
    prenom          VARCHAR(50) NOT NULL,
    nom             VARCHAR(50) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    adresse         VARCHAR(100) NOT NULL
);

ALTER TABLE compte_employe ADD CONSTRAINT compte_employe_pk PRIMARY KEY ( nom_utilisateur );

CREATE TABLE marques (
    id_marque DECIMAL NOT NULL,
    nom       VARCHAR(50) NOT NULL
);

ALTER TABLE marques ADD CONSTRAINT marques_pk PRIMARY KEY ( id_marque );

CREATE TABLE panier (
    id_panier                     DECIMAL NOT NULL,
    compte_client_nom_utilisateur VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX panier__idx ON
    panier (
        compte_client_nom_utilisateur
    ASC );

ALTER TABLE panier ADD CONSTRAINT panier_pk PRIMARY KEY ( id_panier );

CREATE TABLE panier_produits (
    panier_id_panier   DECIMAL NOT NULL,
    produit_id_produit DECIMAL NOT NULL
);

ALTER TABLE panier_produits ADD CONSTRAINT panier_produits_pk PRIMARY KEY ( panier_id_panier,
                                                                            produit_id_produit );

CREATE TABLE produit (
    id_produit               DECIMAL NOT NULL,
    nom                      VARCHAR(200) NOT NULL,
    description              VARCHAR(10000),
    date_parution            DATE NOT NULL,
    prix                     DECIMAL NOT NULL,
    nombrestock              DECIMAL NOT NULL,
    rabais                   DECIMAL,
    marques_id_marque        DECIMAL,
    categories_id_categories DECIMAL
);

ALTER TABLE produit ADD CONSTRAINT produit_pk PRIMARY KEY ( id_produit );

CREATE TABLE session_client (
    id_session                     DECIMAL NOT NULL,
    token                          VARCHAR(200) NOT NULL,
    compte_client_nom_utilisateur  VARCHAR(100),
    compte_employe_nom_utilisateur VARCHAR(100)
);

ALTER TABLE session_client ADD CONSTRAINT session_pk PRIMARY KEY ( id_session );

ALTER TABLE compte_client
    ADD CONSTRAINT compte_client_panier_fk FOREIGN KEY ( panier_id_panier )
        REFERENCES panier ( id_panier );

ALTER TABLE panier
    ADD CONSTRAINT panier_compte_client_fk FOREIGN KEY ( compte_client_nom_utilisateur )
        REFERENCES compte_client ( nom_utilisateur );

ALTER TABLE panier_produits
    ADD CONSTRAINT panier_produits_panier_fk FOREIGN KEY ( panier_id_panier )
        REFERENCES panier ( id_panier );

ALTER TABLE panier_produits
    ADD CONSTRAINT panier_produits_produit_fk FOREIGN KEY ( produit_id_produit )
        REFERENCES produit ( id_produit );

ALTER TABLE produit
    ADD CONSTRAINT produit_categories_fk FOREIGN KEY ( categories_id_categories )
        REFERENCES categories ( id_categories );

ALTER TABLE produit
    ADD CONSTRAINT produit_marques_fk FOREIGN KEY ( marques_id_marque )
        REFERENCES marques ( id_marque );

ALTER TABLE session_client
    ADD CONSTRAINT session_compte_client_fk FOREIGN KEY ( compte_client_nom_utilisateur )
        REFERENCES compte_client ( nom_utilisateur );

ALTER TABLE session_client
    ADD CONSTRAINT session_compte_employe_fk FOREIGN KEY ( compte_employe_nom_utilisateur )
        REFERENCES compte_employe ( nom_utilisateur );



-- Rapport récapitulatif d'Oracle SQL Developer Data Modeler : 
-- 
-- CREATE TABLE                             8
-- CREATE INDEX                             2
-- ALTER TABLE                             16
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0
