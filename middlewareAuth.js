module.exports = {

  loginRequired(req, res, next) {
    console.log(req.session)
    if (req.session.passport.user.id) {
      return next();
    }
  }
};