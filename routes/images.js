var express = require('express');
var moment = require('moment');
var promise = require('bluebird');
var gm = require('gm').subClass({
  imageMagick: true
});

var fs = require('fs');

// Config
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];


var router = express.Router();


router.post('/', function(req, res, next) {

  if (req.files !== undefined && req.files.image) {
    var images = [].concat(req.files.image);

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

  }
  else {
    var err = new Error('null file');
    next(err);
  }
});

// Functions
function resizeAndPostS3(img) {
  return new Promise(function(resolve, reject) {
    gm(img.buffer)
      .size(function(err, size) {

        if (err) return reject(err);

        var width = size.width;
        var height = size.height;
        var totalpixel = width * height;

        if (width > 960 || height > 640) {
          this.resize(960, 640);
        }

        if (img.buffer.length > 20971520) {
          reject('err size');
        }

/*        if (img.size >= (totalpixel) * 0.16) {
          var encodeHQ = (1 - (totalpixel * 0.16) / img.size) * 100;
          console.log(encodeHQ);
          // this.quality(encodeHQ); // chat luong anh
          this.quality(75); // chat luong anh
        }*/
        this.quality(75);
        
        /* save local */
        var subFolder = setSubFolder();
        this.write('./images/' + subFolder + '/' + img.name, function(err) {
          if (err) return reject(err);
          return resolve(config.siteUrl + '/image/' + subFolder + '/' + img.name);
        });
      });
  });
}

function setSubFolder() {
  // Check path exists by moment & create
  var subFolder = moment().format('YYYY[/]MM');
  var path = './images/' + subFolder;
  
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  
  return subFolder;
}
module.exports = router;
