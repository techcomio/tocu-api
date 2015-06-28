var Promise = require('bluebird');
var passport = require('passport');

var authViaToken = function(req, res) {
  return new Promise(function(resolve, reject) {
      passport.authenticate('bearer', {
          session: false
      }, function(err, user) {
          if (user) {
              return resolve(user);
          }

          return reject({
              message: 'Forbidden'
          });
      })(req, res);
  });
};

module.exports = authViaToken;
