const _ = require('lodash');

const db = require('../db');
const TagRepository = require('./tag');

class ReqAulaRepository{
    async inserirProfessorAula(idAula, idProfessor){
        const query = `
            UPDATE REQUISICAO_AULA
            SET ID_PROFESSOR = $1
            WHERE ID = $2
        `;
        await db.query(query, [idProfessor, idAula]);
        return;
    }
    async getAulaById(id){
        const query = 'SELECT * FROM REQUISICAO_AULA WHERE ID = $1';
        return db.query(query, [id]).then(res => res.rows[0]);
    }
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

            await TagRepository.atualizarTagsAula(novaAula.id, tags);

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

    async atualizarAula(id, {titulo, descricao, inicio, fim, tags = []}){
        try{
            await db.query('BEGIN');
            const updateQuery = `
                UPDATE REQUISICAO_AULA
                SET TITULO = $1, DESCRICAO = $2, INICIO = $3, FIM = $4
                WHERE ID = $5
                RETURNING ID, TITULO, DESCRICAO, INICIO, FIM, ID_ALUNO
            `;
            const aulaAtualizada = (await db.query(updateQuery, [titulo, descricao, inicio, fim, id])).rows[0];

            await TagRepository.atualizarTagsAula(id, tags);
            aulaAtualizada.tags = tags;

            await db.query("COMMIT");
            return aulaAtualizada;

        }catch(e){
            await db.query('ROLLBACK');
            throw e;
        }
    }

    async getTagsAula(idAula){
        const res = await db.query('SELECT ID_TAG FROM TAG_AULA WHERE ID_AULA = $1', [idAula]);
        return res.rows.map(r => r.id_tag);
    }
}
module.exports = new ReqAulaRepository();