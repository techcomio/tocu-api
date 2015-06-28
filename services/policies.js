var passport = require('passport');

module.exports = {

  // Auth with token
  isAuthenticated: function(req, res, next) {
    passport.authenticate('bearer', {session: false}, function(err, user) {
      if (user) {

        req.user = user;
        return next();
      }

      return res.status(403).json({
          message: 'Forbidden'
      });
    })(req, res);
  },

  // User level 4 - 10
  isLevel4to10: function(req, res, next) {

    var user = req.user;

    if (user.level >= 4) {
        return next();
    }

    return res.status(403).json({
        message: 'You are not permitted to perform this action'
    });
  }
}
