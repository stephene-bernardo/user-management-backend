module.exports = {

  loginRequired(req, res, next) {
    
    if (req.session.passport && req.session.passport.user.id) {
      return next();
    }
    throw 'error occurred'
  }
};