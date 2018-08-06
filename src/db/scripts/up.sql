CREATE TABLE USUARIO(
    ID BIGSERIAL NOT NULL PRIMARY KEY,
    NOME VARCHAR(50) NOT NULL,
    EMAIL VARCHAR NOT NULL UNIQUE,
    SENHA VARCHAR NOT NULL,
    CPF VARCHAR(11) NOT NULL UNIQUE,
    CELULAR VARCHAR(20) NOT NULL
);

CREATE TABLE PERFIL(
    ID BIGSERIAL NOT NULL PRIMARY KEY,
    NOME VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE USUARIO_PERFIL(
    ID_USUARIO BIGINT NOT NULL
    REFERENCES USUARIO(ID),
    ID_PERFIL BIGINT NOT NULL
    REFERENCES PERFIL(ID),
    STATUS VARCHAR NOT NULL,
    UNIQUE(ID_USUARIO, ID_PERFIL)
);

CREATE TABLE TAG(
    ID BIGSERIAL NOT NULL PRIMARY KEY,
    NOME VARCHAR NOT NULL UNIQUE,
    NOME_SIMPLES VARCHAR NOT NULL
);

CREATE TABLE TAG_PROFESSOR(
    ID_PROFESSOR BIGINT NOT NULL 
    REFERENCES USUARIO(ID),
    ID_TAG BIGINT NOT NULL
    REFERENCES TAG(ID)
);

CREATE TABLE REQUISICAO_AULA(
	ID BIGSERIAL NOT NULL PRIMARY KEY,
	ID_ALUNO BIGINT NOT NULL
	REFERENCES USUARIO(ID),
	ID_PROFESSOR BIGINT
	REFERENCES USUARIO(ID),
	INICIO TIMESTAMP NOT NULL,
	FIM TIMESTAMP NOT NULL,
	TITULO VARCHAR NOT NULL,
	DESCRICAO VARCHAR NOT NULL
);

CREATE TABLE TAG_AULA(
    ID_AULA BIGINT NOT NULL
    REFERENCES REQUISICAO_AULA(ID),
    ID_TAG BIGINT NOT NULL
    REFERENCES TAG(ID)
);

CREATE TABLE LOCALIZACAO_AULA(
    ID_AULA BIGINT NOT NULL UNIQUE
    REFERENCES AULA(ID),
    LATITUDE DECIMAL NOT NULL,
    LONGITUDE DECIMAL NOT NULL
);