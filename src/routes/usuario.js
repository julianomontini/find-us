var router = require('express').Router();
var passport = require('passport');

var UsuarioRepository = require('../repository/usuario');

router.use(passport.authenticate('jwt'));
router.get('/', async (req,res) => {
    const usuario = await UsuarioRepository.getUsuarioFull(req.user.id);
    res.send(usuario);
});

module.exports = router;