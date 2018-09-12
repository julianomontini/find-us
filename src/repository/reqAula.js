const _ = require('lodash');

const db = require('../db');
const TagRepository = require('./tag');
const errorBuilder = require('../api/errorBuilder');

class ReqAulaRepository{
    async inserirProfessorAula(idAula, idProfessor){
        const query = `
            INSERT INTO CANDIDATO_AULA(ID_PROFESSOR, ID_AULA, STATUS)
            VALUES($1, $2, 'PENDENTE')
        `
        await db.query(query, [idProfessor, idAula]);
        return;
    }
    async getAulaById(id){
        const query = 'SELECT * FROM REQUISICAO_AULA WHERE ID = $1';
        return db.query(query, [id]).then(res => res.rows[0]);
    }
    async criar({titulo, descricao, inicio, fim, idAluno, localizacao, preco}){
        const query = `
            INSERT INTO REQUISICAO_AULA(TITULO, DESCRICAO, INICIO, FIM, ID_ALUNO, LOCALIZACAO, PRECO)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING ID, TITULO, DESCRICAO, INICIO, FIM, ID_ALUNO, LOCALIZACAO, PRECO
        `;

        const result = await db.query(query, [titulo, descricao, inicio, fim, idAluno, localizacao, preco]);
        const novaAula = result.rows[0];
        return novaAula;
    }
    async getReqAulaAluno(idAluno){
        const query = `
            SELECT * FROM REQUISICAO_AULA WHERE ID_ALUNO = $1
        `
        const result = await db.query(query, [idAluno]);
        return result.rows;
    }

    async atualizarAula(id, {titulo, descricao, inicio, fim, tags = []}){
        const updateQuery = `
            UPDATE REQUISICAO_AULA
            SET TITULO = $1, DESCRICAO = $2, INICIO = $3, FIM = $4
            WHERE ID = $5
            RETURNING ID, TITULO, DESCRICAO, INICIO, FIM, ID_ALUNO
        `;
        const aulaAtualizada = (await db.query(updateQuery, [titulo, descricao, inicio, fim, id])).rows[0];
        return aulaAtualizada;
    }

    async getTagsAula(idAula){
        const res = await db.query('SELECT ID_TAG FROM TAG_AULA WHERE ID_AULA = $1', [idAula]);
        return res.rows.map(r => r.id_tag);
    }

    async getCandidatosAula(idAula){
        const query = `
            SELECT U.ID as id, U.NOME as nome, CA.STATUS as status
            FROM USUARIO U
            JOIN CANDIDATO_AULA CA
            ON CA.ID_PROFESSOR = U.ID
            WHERE CA.ID_AULA = $1
        `;

        return db.query(query, [idAula]).then(r => r.rows);
    }

    async aprovarCandidato(idAula, idProfessor){
        const resultCandidato = await db.query('SELECT 1 FROM CANDIDATO_AULA WHERE ID_AULA = $1 AND ID_PROFESSOR = $2', [idAula, idProfessor]);
        if(!resultCandidato.rows[0])
            return Promise.reject(errorBuilder({mensagem: 'Usuário não é candidato'}, 400));

        const resultJaAprovados = await db.query('SELECT 1 FROM candidato_aula WHERE ID_AULA = $1 AND STATUS = \'APROVADO\'', [idAula]);
        if(resultJaAprovados.rows[0])
            return Promise.reject(errorBuilder({mensagem: 'Aula já tem candidato aprovado'}, 400))

        try{
            await db.query('BEGIN');
            await db.query('UPDATE REQUISICAO_AULA SET ID_PROFESSOR = $1 WHERE ID = $2', [idProfessor, idAula]);
            await db.query("UPDATE CANDIDATO_AULA SET STATUS = 'APROVADO' WHERE ID_AULA = $1 AND ID_PROFESSOR = $2", [idAula, idProfessor]);
            await db.query("UPDATE CANDIDATO_AULA SET STATUS = 'REJEITADO' WHERE ID_AULA = $1 AND STATUS != 'APROVADO'", [idAula]);
            await db.query("COMMIT");
        }catch(e){
            await db.query('ROLLBACK');
            throw e;
        }
    }

    async rejeitarCandidato(idAula, idCandidato){
        const aprovadoQuery = `
            SELECT 1 FROM CANDIDATO_AULA WHERE ID_AULA = $1 AND ID_PROFESSOR = $2 AND STATUS = 'APROVADO'
        `
        const aprovadoResult = (await db.query(aprovadoQuery, [idAula, idCandidato])).rows[0];
        if(aprovadoResult){
            return Promise.reject(errorBuilder({mensagem: 'Candidato já está aprovado'}));
        }

        await db.query(`UPDATE CANDIDATO_AULA SET STATUS = 'REJEITADO' WHERE ID_AULA = $1 AND ID_PROFESSOR = $2`, [idAula, idCandidato]);
    }

    async buscarAulasPorIdProfessor(idProfessor){
        const result = await db.query(`
            select aluno.nome, aluno.celular, ra.*
            from requisicao_aula ra
            join usuario aluno
            on ra.id_aluno = aluno.id
            where ra.id_professor = $1
        `, [idProfessor]);
        return result.rows;
    }
}
module.exports = new ReqAulaRepository();