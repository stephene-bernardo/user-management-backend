module.exports = {

  loginRequired(req, res, next) {
    if (req.headers.userid) {
      return next();
    }
    return res.redirect('/login');
  }

};