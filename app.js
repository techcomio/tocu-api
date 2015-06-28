'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var crypto = require('crypto');
var IMGR = require('imgr').IMGR;

// Middleware
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var bcrypt = require('bcrypt');

// Routes
var token = require('./routes/token'),
users = require('./routes/users'),
districts = require('./routes/districts'),
cities = require('./routes/cities'),
shopModels = require('./routes/models'),
products = require('./routes/products'),
boxes = require('./routes/boxes'),
boxes = require('./routes/boxes'),
likes = require('./routes/likes'),
images = require('./routes/images');

// models
var models = require('./models');


var env = process.env.NODE_ENV || 'development';

// Passport Local
passport.use(new LocalStrategy({
    usernameField: 'mobilePhone',
    passwordField: 'password'
  },
  function(mobilePhone, password, done) {
    models.User.findOne({where: {mobilePhone: mobilePhone}})
    .then(function(user) {
      if (!user) { return done(null, false, {
          message: 'Not found'
        }); }
      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) return done(null, false, {
          message: 'Invalid Password'
        });
        return done(null, user);
      });
    })
    .catch(function(error) {
      return done(error);
    });
  }
));

// Passport HTTP Bearer
passport.use(new BearerStrategy(
  function(token, done) {

    models.User.findOne({where: {token: token} })
    .then(function(user) {
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    })
    .catch(function(error) {
      return done(error);
    });
  }
));

// Enables CORS
var enableCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, *');

    next();
};

var app = express();

// Get image
var imgr = new IMGR();
imgr.serve('./images/')
    .namespace('/image')
    .urlRewrite('/:path/:size/:file.:ext')
    .whitelist([ '960x640', '640x426', '480x320', '320x213' ])
    .using(app);

app
  .use(enableCORS)
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(multer())
  .use(multer({ // https://github.com/expressjs/multer
    dest: './images/',
    rename: function (fieldname, filename) {
      var key = crypto.randomBytes(10).toString('hex');
      return key + '-' + filename.replace(/\W+/g, '-').toLowerCase();
    },
    onFileUploadStart: function(file) {
      if(! /\/(png|gif|jpg|jpeg|pjpeg)$/i.test(file.mimetype)) {
        return false;
      }
    },
    onError: function(err, next) {
      next(err);
    },
    inMemory: true //This is important. It's what populates the buffer.
  }))
  .use('/image', express.static(__dirname + "/images", {maxage: 8640000}))
  // .use('/assets', express.static(path.join(__dirname, 'assets')))
  .use('/token', token)
  .use('/user', users)
  .use('/district', districts)
  .use('/city', cities)
  .use('/model', shopModels)
  .use('/product', products)
  .use('/box', boxes)
  .use('/like', likes)
  .use('/image', images);



module.exports = app;
