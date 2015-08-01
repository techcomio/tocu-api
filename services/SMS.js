'use strict';
const env = process.env.NODE_ENV || 'development';
const esmsConfig = require(__dirname + '/../config/esms.json')[env];
const promise = require('bluebird');

function esmsCreateSendByRandomBody(phone, msg) {
  var body = '<RQST>' +
    '<APIKEY>' + esmsConfig.esmsApiKey + '</APIKEY>' +
    '<SECRETKEY>' + esmsConfig.esmsSecretKey + '</SECRETKEY>' +
    '<SMSTYPE>4</SMSTYPE>' +
    '<ISFLASH>0</ISFLASH>' +
    '<UNICODE>0</UNICODE>' +
    '<CONTENT>' + msg + '</CONTENT>' +
    '<CONTACTS>';

  if (typeof phone === 'string') {
    phone = [phone];
  }
  if (Object.prototype.toString.call(phone) !== "[object Array]") {
    return false;
  }

  for (var i = 0; i < phone.length; i++) {
    body = body +
      '<CUSTOMER>' +
      '<PHONE>' + phone[i] + '</PHONE>' +
      '</CUSTOMER>';
  }

  body = body + '</CONTACTS>' + '</RQST>';
  return body;
}

let http = require('http');
module.exports = {
  send: function(phone, code) {
    return new promise(function(resolve, reject) {
      let data = esmsCreateSendByRandomBody(phone, code);
      let postRequest = {
        host: esmsConfig.esmsHost,
        path: esmsConfig.esmsSendByRandomPath,
        method: 'POST',
        headers: {
          'Cookie': 'cookie',
          'Content-Type': 'text/plain',
        }
      };

      let req = http.request(postRequest, function(res) {
        let buffer = "";

        res.on("data", function(data) {
          buffer = buffer + data;
        });
        res.on("end", function() {
          // if (callback)
            // callback(esmsParseRandomResult(buffer));
          return resolve(esmsParseRandomResult(buffer));
        });
      });
      req.on('error', function(e) {
        return reject('problem with request: ' + e.message);
      });
      req.write(data);
      req.end();
    })
  },

  // Templates
  sendAccount: function(phone, password) {
    let code = '[To Cu] Tai khoan cua ban vua duoc tao tai www.tocu.vn. Su dung so dien thoai cua ban cung mat khau: ' + password + ' de dang nhap.';
    return this.send(phone, code);
  }
};


function esmsParseRandomResult(result) {
  let json = {};

  for (var i = 0; i < esmsRandomResult.length; i++) {
    let elem = esmsRandomResult[i];
    let start = result.indexOf(elem.StartTag) + elem.StartTag.length;
    let end = result.indexOf(elem.EndTag);
    if (end > 0 && start > 0) {
      json[elem.Name] = result.slice(start, end);
    }

  }

  return json;
}

let esmsRandomResult = [{
  StartTag: '<CodeResult>',
  EndTag: '</CodeResult>',
  Name: 'CodeResult',
}, {

  StartTag: '<SMSID>',
  EndTag: '</SMSID>',
  Name: 'SMSID',
}, {

  StartTag: '<ErrorMessage>',
  EndTag: '</ErrorMessage>',
  Name: 'ErrorMessage'
}];
