var router = require('express').Router();
var passport = require('passport');
const jwt = require('jwt-simple');

var UsuarioService = require('../services/usuario');
var AuthService = require('../services/authentication');

var UsuarioRepository = require('../repository/usuario');

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, AuthService.jwtOptions.secretOrKey);
}

router.post('/cadastro', async (req,res) => {
    const { nome, email, senha, cpf, celular, perfil} = req.body;
    try{
        const result = await UsuarioService.criarUsuario({nome, email, senha, cpf, celular, perfil});
        res.send(result);
    }catch(e){
        res.status(400).send(e);
    }
});
router.post('/login', passport.authenticate('local'), async (req,res) => {
    try{
        const usuario = await UsuarioRepository.getUsuarioFull(req.user.id);
        res.send({...usuario, token: tokenForUser(req.user)})
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = router;