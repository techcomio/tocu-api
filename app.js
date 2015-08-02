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
  images = require('./routes/images'),
  ships = require('./routes/ships'),
  orders = require('./routes/orders'),
  orderlines = require('./routes/orderlines');

// models
var models = require('./models');

// Redis
var redisHelper = require('./services/redisHelper');


// Passport Local
passport.use(new LocalStrategy({
    usernameField: 'mobilePhone',
    passwordField: 'password'
  },
  function(mobilePhone, password, done) {
    models.User.findOne({
        where: {
          mobilePhone: mobilePhone
        }
      })
      .then(function(user) {
        if (!user) {
          return done(null, false, {
            message: 'Not found'
          });
        }
        bcrypt.compare(password, user.password, function(err, res) {
          console.log(err, res);
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
  function(access_token, done) {
    redisHelper.get(access_token)
      .then(function(user) {
        return done(null, user, {
          scope: 'all'
        });
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

/*
Get image by size

http://localhost:3000//:path/:size/:file.:ext
Example: http://tocu-api-dev-tranduchieu.c9.io/image/100x100/c8c402e41f893cdafcbb-photo-2016-2012-2010-2004-05-2015.jpg
*/
var imgr = new IMGR();
imgr.serve('./images/')
  .namespace('/image')
  .urlRewrite('/:path/:size/:file.:ext')
  .whitelist(['960x640', '640x426', '480x320', '468x', 'x468', '320x213', '320x', 'x320', 'x230', '230x', '220x220', '220x53', '192x130', '100x100', '100x', 'x100', '90x60', '50x50'])
  .using(app);


app
  .use(enableCORS)
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  // .use(multer())
  .use(multer({ // https://github.com/expressjs/multer
    dest: './images/',
    rename: function(fieldname, filename) {
      var key = crypto.randomBytes(10).toString('hex');
      return key + '-' + filename.replace(/\W+/g, '-').toLowerCase();
    },
    onFileUploadStart: function(file) {
      if (!/\/(png|gif|jpg|jpeg|pjpeg)$/i.test(file.mimetype)) {
        return false;
      }
    },
    onError: function(err, next) {
      next(err);
    },
    inMemory: true //This is important. It's what populates the buffer.
  }))
  .use('/image', express.static(__dirname + "/images", {
    maxage: 8640000
  }))
  // .use('/assets', express.static(path.join(__dirname, 'assets')))
  .use('/token', token)
  .use('/user', users)
  .use('/district', districts)
  .use('/city', cities)
  .use('/model', shopModels)
  .use('/product', products)
  .use('/box', boxes)
  .use('/like', likes)
  .use('/image', images)
  .use('/ship', ships)
  .use('/order', orders)
  .use('/orderline', orderlines);



module.exports = app;
