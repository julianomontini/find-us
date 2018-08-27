const _ = require('lodash');
const db = require('../db');

class PerfilRepository{
    async findIdsPerfisByNome(nomes = []){
        if(_.isEmpty(nomes))
            return Promise.resolve([]);
        
        var names;
        if(nomes.length == 1){
            names = `'${nomes[0]}'`;
        }else{
            names = nomes.reduce((a, b) => `'${a}', '${b}'`)
        }
        const query = `
            SELECT ID
            FROM PERFIL
            WHERE NOME IN (${names})
        `
        const result = await db.query(query);
        return result.rows;
    }
    async findPerfisByIdUsuario(idUsuario){
        const query = `
            select p.nome
            from perfil p
            join usuario_perfil up
            on up.id_perfil = p.id
            where up.id_usuario = $1
        `;
        const result = (await db.query(query, [idUsuario]));
        return result.rows;
    }

    async usuarioTemPerfil(idUsuario, perfil){
        const query = `
            SELECT COUNT(1) > 0 AS TEM_PERFIL
            FROM PERFIL P
            JOIN USUARIO_PERFIL UP
            ON P.ID = UP.ID_PERFIL
            WHERE UP.ID_USUARIO = $1
            AND P.NOME = $2
        `;
        const result = await db.query(query, [idUsuario, perfil])
        return result.rows[0].tem_perfil;
    }
}

module.exports = new PerfilRepository();