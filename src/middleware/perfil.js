const PerfilRepository = require('../repository/perfil');

module.exports = nomePerfil => async (req, res, next) => {
    try{
        const isAluno = await PerfilRepository.usuarioTemPerfil(req.user.id, nomePerfil);
        if(isAluno) next();
        else next('Acesso negado')
    }catch(e){next(e)}
}