'use strict';
require('babel/register')({ 
 stage: 0
});

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config.json')[env];
var app = require('./app');
var models = require("./models");

app.set('port', process.env.PORT || config.port || 3000);

// models.sequelize.sync().then(function () {
//   var server = app.listen(app.get('port'), function() {
//     // debug('Express server listening on port ' + server.address().port);
//   });
// });

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Node app listening at http://%s:%s', process.env.IP || host, port);
});