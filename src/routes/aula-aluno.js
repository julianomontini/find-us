var router = require('express').Router();
var passport = require('passport');

var AulaService = require('../services/reqAula');

var PerfilMiddleware = require('../middleware/perfil')
router.use(passport.authenticate('jwt'), PerfilMiddleware('Aluno'));

router.post('/criar', async (req, res) => {
    const { titulo, descricao, inicio, fim, tags } = req.body;
    try{
        const result = await AulaService.criar({titulo, descricao, inicio, fim, tags, idUsuario: req.user.id});
        res.send(result);
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = router;