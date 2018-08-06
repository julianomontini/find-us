const db = require('../db/db');

const TagService = require('../services/tag');

class ReqAulaRepository{
    async criar({titulo, descricao, inicio, fim, idAluno, tags}){

        const dbTags = [];

        for(let tag of tags){
            const result = await TagService.criarSeNaoExistir(tag);
            dbTags.push(result);
        }

        try{
            await db.query('BEGIN');
    
            const query = `
                INSERT INTO REQUISICAO_AULA(TITULO, DESCRICAO, INICIO, FIM, ID_ALUNO)
                VALUES($1, $2, $3, $4, $5)
                RETURNING ID, TITULO, DESCRICAO, INICIO, FIM, ID_ALUNO
            `;
            const result = await db.query(query, [titulo, descricao, inicio, fim, idAluno]);
            const novaAula = result.rows[0];
            for(let tag of dbTags){
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
}
module.exports = new ReqAulaRepository();