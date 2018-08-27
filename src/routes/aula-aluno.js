var router = require('express').Router();
var passport = require('passport');

var AulaService = require('../services/reqAula');

var PerfilMiddleware = require('../middleware/perfil')
router.use(passport.authenticate('jwt'), PerfilMiddleware('Aluno'));

router.post('/', async (req, res, next) => {
    const { titulo, descricao, inicio, fim, tags } = req.body;
    try{
        const result = await AulaService.criar({titulo, descricao, inicio, fim, tags, idUsuario: req.user.id});
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
router.put('/:id', async(req,res,next) =>{
    try{
        const aula = await AulaService.atualizarAula(req.user.id, req.params.id, req.body);
        res.send(aula);
    }catch(e){
        next(e);
    }
})

module.exports = router;