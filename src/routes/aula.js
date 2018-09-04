var router = require('express').Router();
var passport = require('passport');
const _ = require('lodash');

var elasticApi = require('../elasticsearch/api');
var PerfilMiddleware = require('../middleware/perfil');
var ReqAulaService = require('../services/reqAula');
router.use(passport.authenticate('jwt'), PerfilMiddleware('Professor'));

router.post('/search', async (req,res) => {
    if(!req.body.term)
        return res.status(400).send({mensagem: 'Termo obrigatório'});
    const results = await elasticApi.aula.findSugestoesAulaByTermo(req.body);
    const aulas = _.map(results.hits.hits, r => r._source);
    res.send(aulas);
});

router.post('/inscrever/:id', async(req,res,next) => {
    try{
        await ReqAulaService.inscreverProfessor(req.params.id, req.user.id);
        res.send();
    }catch(e){
        next(e);
    }
});

module.exports = router;