module.exports = {
    sucesso: (objeto) => {
        return { 
            sucesso: true,
            objeto: objeto ? objeto : null
        }
    },
    erro: (motivo) => {
        return { 
            sucesso: false,
            motivo
        }
    }
}