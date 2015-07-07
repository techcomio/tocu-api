var config = require('./config/config.json');
var app = require('./app');
var models = require("./models");

app.set('env', config.env || process.env.NODE_ENV || 'development');
app.set('port', config.port || process.env.PORT || 3000);

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
    // debug('Express server listening on port ' + server.address().port);
  });
});
