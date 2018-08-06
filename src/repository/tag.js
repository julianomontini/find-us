const db = require('../db/db');

class TagService{
    async procuraTagPorNomeSimples(nome){
        const query = `
            SELECT ID, NOME, NOME_SIMPLES
            FROM TAG
            WHERE NOME_SIMPLES = $1
        `;
        const result = await db.query(query, [nome]);
        return result.rows[0];
    }

    async criarTag(nome, nomeSimples){
        const query = `
            INSERT INTO TAG(NOME, NOME_SIMPLES)
            VALUES($1, $2)
            RETURNING ID, NOME, NOME_SIMPLES
        `;
        const result = await db.query(query, [nome, nomeSimples]);
        return result.rows[0];
    }

    async procuraTagsPorIdAula(idAula){
        const query = `
            SELECT T.ID AS ID, T.NOME AS NOME, T.NOME_SIMPLES AS NOME_SIMPLES
            FROM TAG T
            JOIN TAG_AULA TA
            ON TA.ID_TAG = T.ID
            WHERE TA.ID_AULA = $1
        `;
        const result = await db.query(query, [idAula]);
        console.log(result.rows);
        return result.rows;
    }
}

module.exports = new TagService();