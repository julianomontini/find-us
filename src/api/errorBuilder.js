module.exports = (status = 400, ...error) => {
    return {
        status, errors: [...error]
    }
}