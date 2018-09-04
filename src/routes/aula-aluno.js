var router = require('express').Router();
var passport = require('passport');

var AulaService = require('../services/reqAula');

var TagRepository = require('../repository/tag');
var ReqAulaRepository = require('../repository/reqAula');

var PerfilMiddleware = require('../middleware/perfil')
router.use(passport.authenticate('jwt'), PerfilMiddleware('Aluno'));

router.post('/', async (req, res, next) => {
    const { titulo, descricao, inicio, fim, tags, localizacao, preco } = req.body;
    console.log('as coordenadas recebidas foram', localizacao);
    try{
        const result = await AulaService.criar({titulo, descricao, inicio, fim, tags, idUsuario: req.user.id, localizacao, preco});
        res.send(result);
    }catch(e){
        next(e);
    }
})

router.get('/', async(req,res,next) => {
    try{
        const aulas = await AulaService.getReqAulaAluno(req.user.id);
        res.send(aulas);
    }catch(e){
        next(e);
    }
})


router.get('/:id', async(req,res,next) => {
    const idAula = req.params.id;
    try{
        const aula = await AulaService.getDetalheAula(idAula);
        if(!aula)
        return res.status(404).send();
        if(aula.id_aluno !== req.user.id)
        return res.status(403).send();
        res.send(aula);
    }catch(e){
        next(e);
    }
})
router.get('/:id/tags', (req,res,next) => {
    TagRepository
        .procuraTagsPorIdAula(req.params.id)
        .then(r => res.send(r))
        .catch(e => next(e));
})
router.get('/:id/candidatos', (req,res,next) => {
    ReqAulaRepository
        .getCandidatosAula(req.params.id)
        .then(r => res.send(r))
        .catch(e => next(e))
})
router.put('/:id/aprovar', (req,res,next) => {
    ReqAulaRepository
        .aprovarCandidato(req.params.id, req.body.idProfessor)
        .then(r => res.send())
        .catch(e => next(e))
})
router.put('/:id', async(req,res,next) =>{
    try{
        const aula = await AulaService.atualizarAula(req.user.id, req.params.id, req.body);
        res.send(aula);
    }catch(e){
        next(e);
    }
})

module.exports = router;