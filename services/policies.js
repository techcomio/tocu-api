let passport = require('passport');
let redisHelper = require('./redisHelper');

module.exports = {

  // Auth with token
  isAuthenticated: function(req, res, next) {
    if (req.query.access_token) {
      redisHelper.get(req.query.access_token)
        .then(function(user) {
          if (user) {
            req.user = user;
            return next();
          }
          else {
            throw new Error;
          }
        })
        .catch(function(error) {
          return res.status(403).json('Forbidden');
        });
    }
    else {
      passport.authenticate('bearer', {
        session: false
      }, function(err, user) {
        if (user) {

          req.user = user;
          return next();
        }

        return res.status(403).json('Forbidden');
      })(req, res);
    }
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
  },

  // User level 10 - 100 (Sale, Maneger, Admin)
  isLevel10to100: function(req, res, next) {

    var user = req.user;

    if (user.level >= 10) {
      return next();
    }

    return res.status(403).json({
      message: 'You are not permitted to perform this action'
    });
  },

  // User level 10 - 49 (Sale)
  isLevel10to49: function(req, res, next) {

    var user = req.user;

    if (user.level >= 10 && user.level <= 49) {
      return next();
    }

    return res.status(403).json({
      message: 'You are not permitted to perform this action'
    });
  },

  // User level 10 - 99 (Sale & Manager)
  isLevel10to99: function(req, res, next) {

    var user = req.user;

    if (user.level >= 10 && user.level <= 99) {
      return next();
    }

    return res.status(403).json({
      message: 'You are not permitted to perform this action'
    });
  },

  // User level 50 - 99 (Manager)
  isLevel50to99: function(req, res, next) {

    var user = req.user;

    if (user.level >= 50 && user.level <= 99) {
      return next();
    }

    return res.status(403).json({
      message: 'You are not permitted to perform this action'
    });
  },

  // User level 50 - 100 (Manager & Admin)
  isLevel50to100: function(req, res, next) {

    var user = req.user;

    if (user.level >= 50 && user.level <= 100) {
      return next();
    }

    return res.status(403).json({
      message: 'You are not permitted to perform this action'
    });
  },

  // User level 100 (Admin)
  isLevel100: function(req, res, next) {

    var user = req.user;

    if (user.level == 100) {
      return next();
    }

    return res.status(403).json({
      message: 'You are not permitted to perform this action'
    });
  }
}
