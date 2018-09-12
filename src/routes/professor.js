var router = require('express').Router();
var passport = require('passport');

var PerfilMiddleware = require('../middleware/perfil');
var AulaRepository = require('../repository/reqAula');

router.use(passport.authenticate('jwt'), PerfilMiddleware('Professor'));
router.get('/aulas', async (req, res, next) => {
    AulaRepository
        .buscarAulasPorIdProfessor(req.user.id)
        .then(aulas => res.send(aulas))
        .catch(e => next(e))
})


module.exports = router;