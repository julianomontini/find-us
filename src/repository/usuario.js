const db = require('../db/db');
const PerfilRepository = require('./perfil');

class UsuarioRepository{
    async findUsuarioByEmail(email){
        const query = `
            SELECT *
            FROM USUARIO
            WHERE EMAIL = $1
        `;
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    async findUsuarioById(id){
        const query = `
            SELECT *
            FROM USUARIO
            WHERE ID = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async findUsuarioByCpf(cpf){
        const query = `
            SELECT *
            FROM USUARIO
            WHERE CPF = $1
        `;
        const result = await db.query(query, [cpf]);
        return result.rows[0];
    }

    async getUsuarioFull(idUsuario){
        const query = `
            SELECT ID, NOME, EMAIL, CELULAR
            FROM USUARIO
            WHERE ID = $1
        `;
        const usuario = (await db.query(query, [idUsuario])).rows[0];
        const perfis = await PerfilRepository.findPerfisByIdUsuario(idUsuario);
        usuario.perfis = perfis;
        return usuario;

    }

    async criaUsuario({nome, email, senha, cpf, celular, perfis = []}){
        const idPerfis = await PerfilRepository.findIdsPerfisByNome(perfis);
        try{
            await db.query('BEGIN');

            const createUserQuery = `
                INSERT INTO USUARIO(NOME, EMAIL, SENHA, CPF, CELULAR)
                VALUES($1, $2, $3, $4, $5)
                RETURNING ID, NOME, EMAIL, CPF, CELULAR
            `;
            const createUserResult = await db.query(createUserQuery, [nome, email, senha, cpf, celular]);
            const newUser = createUserResult.rows[0];
            
            let idPerfis = (await PerfilRepository.findIdsPerfisByNome(perfis)).map(p => p.id);
            for(let idPerfil of idPerfis){
                const createPerfilQuery = `
                    INSERT INTO USUARIO_PERFIL(ID_USUARIO, ID_PERFIL, STATUS)
                    VALUES($1, $2, $3)
                `;
                await db.query(createPerfilQuery, [newUser.id, idPerfil, 'ativo']);
            }

            await db.query("COMMIT");
            return newUser;
        }catch(e){
            await db.query("ROLLBACK");
            throw e;
        }
    }
}

module.exports = new UsuarioRepository();