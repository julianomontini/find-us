var router = require('express').Router();
const TagService = require('../services/tag');

router.get('/sugestoes', async (req, res, next) => {
    const term = req.query.tag;
    const sugestoes = await TagService.procurarSugestoes(term);
    
    res.send(sugestoes);
})

module.exports = router;