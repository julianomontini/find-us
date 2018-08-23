var router = require('express').Router();
var passport = require('passport');
const _ = require('lodash');

var elastic = require('../db/elasticsearch');

var PerfilMiddleware = require('../middleware/perfil')
router.use(passport.authenticate('jwt'), PerfilMiddleware('Professor'));

router.get('/', async(req,res,next) => {
    const term = req.query.term;
    if(!term)
        return res.status(400).send({mensagem: 'Termo obrigatório'});
    const results = await elastic.search({
        index: 'requisicao_aula',
        body: {
            query: {
                bool: {
                    must: [{
                        multi_match: {
                            query: term,
                            fields: [
                                'titulo',
                                'descricao',
                                'tags'
                            ]
                        }
                    }],
                    should: [{
                            match_phrase: {
                                titulo: {
                                    query: term,
                                    slop: 3,
                                    boost: 5
                                }
                            }
                        },
                        {
                            match_phrase: {
                                descricao: {
                                    query: term,
                                    slop: 5,
                                    boost: 2
                                }
                            }
                        }
                    ]
                }
            }
        }
    });
    const aulas = _.map(results.hits.hits, r => r._source);
    res.send(aulas);
});

module.exports = router;