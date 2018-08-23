const db = require('../db/db');

const TagService = require('../services/tag');

class ReqAulaRepository{
    async criar({titulo, descricao, inicio, fim, idAluno, tags}){
        try{
            await db.query('BEGIN');
    
            const query = `
                INSERT INTO REQUISICAO_AULA(TITULO, DESCRICAO, INICIO, FIM, ID_ALUNO)
                VALUES($1, $2, $3, $4, $5)
                RETURNING ID, TITULO, DESCRICAO, INICIO, FIM, ID_ALUNO
            `;
            const result = await db.query(query, [titulo, descricao, inicio, fim, idAluno]);
            const novaAula = result.rows[0];
            for(let tag of tags){
                const tagQuery = `
                    INSERT INTO TAG_AULA(ID_AULA, ID_TAG)
                    VALUES($1, $2)
                `;
                await db.query(tagQuery, [novaAula.id, tag.id]);
            }
            await db.query('COMMIT');
            return novaAula;
        }catch(e){
            await db.query('ROLLBACK');
            throw e;
        }
    }
    async getReqAulaAluno(idAluno){
        const query = `
            SELECT * FROM REQUISICAO_AULA WHERE ID_ALUNO = $1
        `
        const result = await db.query(query, [idAluno]);
        return result.rows;
    }

    async getAulaFull(idAula){
        const query = `
            SELECT 
                ra.id, 
                ra.id_aluno,
                ra.titulo,
                ra.descricao, 
                ra.inicio, 
                ra.inicio, 
                ra.fim,
                (
                    SELECT JSON_AGG(JSON_BUILD_OBJECT('id', T.ID, 'nome', T.NOME, 'nome_simples', T.NOME_SIMPLES))
                    FROM TAG_AULA TA
                    JOIN TAG T
                    ON TA.ID_TAG = T.ID
                    WHERE TA.ID_AULA = RA.ID
                ) as tags,
                (
                    SELECT JSON_BUILD_OBJECT('nome', U.NOME, 'celular', u.celular)
                    FROM USUARIO U
                    WHERE ID = ra.id_professor
                ) as professor
            FROM requisicao_aula ra
            WHERE id = $1
        `;
        const result = await db.query(query, [idAula]);
        if(result.rows)
            return result.rows[0];
        return null;
    }
}
module.exports = new ReqAulaRepository();