var esmsConfig = require(__dirname + '/../config/esms.json')[env]);

function esmsCreateSendByRandomBody(phone, msg) {
    var body = '<RQST>' +
        '<APIKEY>' + esmsConfig.esmsApiKey + '</APIKEY>' +
        '<SECRETKEY>' + esmsConfig.esmsSecretKey + '</SECRETKEY>' +
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

var http = require('http');
module.exports = {
    send: function(phone, code, callback) {
        var data = esmsCreateSendByRandomBody(phone, code);
        var postRequest = {
            host: esmsConfig.esmsHost,
            path: esmsConfig.esmsSendByRandomPath,
            method: 'POST',
            headers: {
                'Cookie': 'cookie',
                'Content-Type': 'text/plain',
            }
        };

        var req = http.request(postRequest, function(res) {
            var buffer = "";

            res.on("data", function(data) {
                buffer = buffer + data;
            });
            res.on("end", function() {
                if (callback)
                    callback(esmsParseRandomResult(buffer));
            });
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        req.write(data);
        req.end();
    },

    // Templates
    sendAccount: function(phone, password) {
        var code = '[To Cu] Tai khoan cua ban vua duoc tao tai www.tocu.vn. Su dung so dien thoai cua ban cung mat khau: ' + password + ' de dang nhap.';
        return this.send(phone, code);
    }
};


function esmsParseRandomResult(result) {
    var json = {};

    for (var i = 0; i < esmsRandomResult.length; i++) {
        elem = esmsRandomResult[i];
        var start = result.indexOf(elem.StartTag) + elem.StartTag.length;
        var end = result.indexOf(elem.EndTag);
        if (end > 0 && start > 0) {
            json[elem.Name] = result.slice(start, end);
        }

    }

    return json;
}

var esmsRandomResult = [{
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
