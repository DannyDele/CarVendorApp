const handleAsync = fnc => {
    return(req, res, next) => {
        fnc(req, res, next).catch(err => next(err));
    }
}
module.exports = handleAsync;

