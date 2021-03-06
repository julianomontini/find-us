ALTER TABLE requisicao_aula
ADD COLUMN LOCALIZACAO JSONB NOT NULL;

CREATE TABLE CANDIDATO_AULA(
ID_PROFESSOR BIGINT NOT NULL REFERENCES USUARIO(ID),
ID_AULA BIGINT NOT NULL REFERENCES REQUISICAO_AULA(ID),
STATUS VARCHAR NOT NULL
);

ALTER TABLE REQUISICAO_AULA
ADD COLUMN PRECO NUMERIC NOT NULL;