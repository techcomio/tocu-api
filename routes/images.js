var express = require('express');
var moment  = require('moment');
var promise = require('bluebird');
var gm      = require('gm').subClass({imageMagick: true});

// Config
var env     = process.env.NODE_ENV || 'development';
var config  = require(__dirname + '/../config/config.json')[env];


var router = express.Router();


router.post('/', function(req, res, next) {

  if(req.files !== undefined && req.files.image) {
    var images = [].concat(req.files.image)

    function resizeAndPostS3(img) {
      return new Promise(function(resolve, reject) {
        gm(img.buffer)
          .size(function(err, size) {
            var width = size.width;
            var height = size.height;
            var totalpixel = width * height;

            if(width > 960 || height > 640) {
              this.resize(960, 640);
            }

            if(img.buffer.length > 20971520 ) {
              reject('err size');
            }

            if(img.size >= (totalpixel) * 0.16) {
              var encodeHQ = (1 - (totalpixel * 0.16) / img.size) * 100;
              console.log(encodeHQ);
              // this.quality(encodeHQ); // chat luong anh
              this.quality(30); // chat luong anh
            }

            /* save local */
            this.write('./images/' + img.name, function (err) {
              if (err) reject(err);
              resolve(config.siteUrl + '/image/' + img.name);
            });
          });
      });
    }

    promise.map(images, function(img) {
      return resizeAndPostS3(img).then(function(result) {
        return result;
      }).catch(function(err) {
        return err;
      });
    }).then(function(result) {
      res.send(result);
    }).catch(function(err) {
      next(err);
    });

  } else {
    var err = new Error('null file');
    next(err);
  }
});

module.exports = router;
