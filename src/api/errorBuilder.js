module.exports = (message={erro: "Erro genérico"}, status=400) => {
    return {
        status, message
    }
}