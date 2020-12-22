module.exports = function (req, res, next) {
    //global variables
    res.locals.isAuth = req.session.isAuthicated;
    res.locals.csrf = req.csrfToken();
    next()
}

