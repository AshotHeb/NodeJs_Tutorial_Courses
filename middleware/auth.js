module.exports = function(req,res,next){
    if(!req.session.isAuthicated){
        return res.redirect('/auth/login#login')
    }
    next();
}