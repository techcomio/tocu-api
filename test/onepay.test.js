'use strict';
import crypto from 'crypto';
import assert from 'assert';
import supertest from 'supertest';

let params = [{
  key: 'vpc_Amount',
  value: 100
}, {
  key: 'Title',
  value: 'VPC 3 Party'
}, {
  key: 'vpc_Version',
  value: 2
}, {
  key: 'vpc_AccessCode',
  value: 'D67342C2'
}, {
  key: 'vpc_Command',
  value: 'pay'
}, {
  key: 'vpc_Currency',
  value: 'VND'
}, {
  key: 'vpc_Customer_Id',
  value: 'thanhvt'
}, {
  key: 'vpc_Customer_Phone',
  value: '0904906903'
}, {
  key: 'vpc_Locale',
  value: 'vn'
}, {
  key: 'vpc_MerchTxnRef',
  value: '20150804204838736576711'
}, {
  key: 'vpc_Merchant',
  value: 'ONEPAY'
}, {
  key: 'vpc_OrderInfo',
  value: 'JSECURETEST01'
}, {
  key: 'vpc_ReturnURL',
  value: 'http://tocu.vn/order/payment-return'
}, {
  key: 'vpc_SHIP_City',
  value: 'Ha Noi'
}, {
  key: 'vpc_SHIP_Country',
  value: 'Viet Nam'
}, {
  key: 'vpc_SHIP_Provice',
  value: 'Hoan Kiem'
}, {
  key: 'vpc_SHIP_Street01',
  value: '39A Ngo Quyen'
}, {
  key: 'vpc_TicketNo',
  value: '10.240.205.139'

}];

let paramsUrl = '';
let api = supertest('https://mtf.onepay.vn/onecomm-pay/vpc.op');

const SECURE_SECRET = "A3EFDFABA8653DF2342E8DAC29B51AF0"


params.sort(function(a, b) {
  if (a.key > b.key) {
    return 1;
  }
  if (a.key < b.key) {
    return -1;
  }
  // a must be equal to b
  return 0;
});

let stringHashData = '';

for (let i = 0; i < params.length; i++) {
  let param = params[i];
  if (param.value) {
    if (i === 0) {
      paramsUrl = paramsUrl + encodeURIComponent(param.key) + '=' + encodeURIComponent(param.value);
    }
    else {
      paramsUrl = paramsUrl + '&' + encodeURIComponent(param.key) + '=' + encodeURIComponent(param.value);
    }

    if (param.key.substr(0, 4) == 'vpc_' || param.key.substr(0, 5) == 'user_') {
      stringHashData = stringHashData + param.key + '=' + param.value + '&';
    }
  }
}

stringHashData = stringHashData.slice(0, -1);


let vpc_SecureHash = crypto.createHmac("SHA256", pack('H*', SECURE_SECRET)).update(stringHashData).digest("hex").toUpperCase();

describe('OnePAY', function() {
  it('hash params return string', function() {
    console.log(vpc_SecureHash);
    assert.notEqual(vpc_SecureHash, null);
  });

  it('post a payment', function(done) {
    console.log(vpc_SecureHash);
    api.post('?' + paramsUrl + '&vpc_SecureHash=' + vpc_SecureHash)
      // .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res);
        if (err) return done(err);
        done();
      });
  });
});


function pack(format) {
  //  discuss at: http://phpjs.org/functions/pack/
  // original by: Tim de Koning (http://www.kingsquare.nl)
  //    parts by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Tim de Koning (http://www.kingsquare.nl)
  //        note: Float encoding by: Jonas Raoni Soares Silva
  //        note: Home: http://www.kingsquare.nl/blog/12-12-2009/13507444
  //        note: Feedback: phpjs-pack@kingsquare.nl
  //        note: 'machine dependent byte order and size' aren't
  //        note: applicable for JavaScript; pack works as on a 32bit,
  //        note: little endian machine
  //   example 1: pack('nvc*', 0x1234, 0x5678, 65, 66);
  //   returns 1: '4xVAB'
  //   example 2: pack('H4', '2345')
  //   returns 2: '#E'
  //   example 3: pack('H*', 'D5')
  //   returns 3: 'Õ'
  //   example 4: pack('d', -100.876)
  //   returns 4: "\u0000\u0000\u0000\u0000\u00008YÀ"

  var formatPointer = 0,
    argumentPointer = 1,
    result = '',
    argument = '',
    i = 0,
    r = [],
    instruction, quantifier, word, precisionBits, exponentBits, extraNullCount;

  // vars used by float encoding
  var bias, minExp, maxExp, minUnnormExp, status, exp, len, bin, signal, n, intPart, floatPart, lastBit, rounded, j,
    k, tmpResult;

  while (formatPointer < format.length) {
    instruction = format.charAt(formatPointer);
    quantifier = '';
    formatPointer++;
    while ((formatPointer < format.length) && (format.charAt(formatPointer)
        .match(/[\d\*]/) !== null)) {
      quantifier += format.charAt(formatPointer);
      formatPointer++;
    }
    if (quantifier === '') {
      quantifier = '1';
    }

    // Now pack variables: 'quantifier' times 'instruction'
    switch (instruction) {
      case 'a':
        // NUL-padded string
      case 'A':
        // SPACE-padded string
        if (typeof arguments[argumentPointer] === 'undefined') {
          throw new Error('Warning:  pack() Type ' + instruction + ': not enough arguments');
        }
        else {
          argument = String(arguments[argumentPointer]);
        }
        if (quantifier === '*') {
          quantifier = argument.length;
        }
        for (i = 0; i < quantifier; i++) {
          if (typeof argument[i] === 'undefined') {
            if (instruction === 'a') {
              result += String.fromCharCode(0);
            }
            else {
              result += ' ';
            }
          }
          else {
            result += argument[i];
          }
        }
        argumentPointer++;
        break;
      case 'h':
        // Hex string, low nibble first
      case 'H':
        // Hex string, high nibble first
        if (typeof arguments[argumentPointer] === 'undefined') {
          throw new Error('Warning: pack() Type ' + instruction + ': not enough arguments');
        }
        else {
          argument = arguments[argumentPointer];
        }
        if (quantifier === '*') {
          quantifier = argument.length;
        }
        if (quantifier > argument.length) {
          throw new Error('Warning: pack() Type ' + instruction + ': not enough characters in string');
        }

        for (i = 0; i < quantifier; i += 2) {
          // Always get per 2 bytes...
          word = argument[i];
          if (((i + 1) >= quantifier) || typeof argument[i + 1] === 'undefined') {
            word += '0';
          }
          else {
            word += argument[i + 1];
          }
          // The fastest way to reverse?
          if (instruction === 'h') {
            word = word[1] + word[0];
          }
          result += String.fromCharCode(parseInt(word, 16));
        }
        argumentPointer++;
        break;

      case 'c':
        // signed char
      case 'C':
        // unsigned char
        // c and C is the same in pack
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer]);
          argumentPointer++;
        }
        break;

      case 's':
        // signed short (always 16 bit, machine byte order)
      case 'S':
        // unsigned short (always 16 bit, machine byte order)
      case 'v':
        // s and S is the same in pack
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
          argumentPointer++;
        }
        break;

      case 'n':
        // unsigned short (always 16 bit, big endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning: pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
          argumentPointer++;
        }
        break;

      case 'i':
        // signed integer (machine dependent size and byte order)
      case 'I':
        // unsigned integer (machine dependent size and byte order)
      case 'l':
        // signed long (always 32 bit, machine byte order)
      case 'L':
        // unsigned long (always 32 bit, machine byte order)
      case 'V':
        // unsigned long (always 32 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
          argumentPointer++;
        }

        break;
      case 'N':
        // unsigned long (always 32 bit, big endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
          argumentPointer++;
        }
        break;

      case 'f':
        // float (machine dependent size and representation)
      case 'd':
        // double (machine dependent size and representation)
        // version based on IEEE754
        precisionBits = 23;
        exponentBits = 8;
        if (instruction === 'd') {
          precisionBits = 52;
          exponentBits = 11;
        }

        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer;
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
        }
        for (i = 0; i < quantifier; i++) {
          argument = arguments[argumentPointer];
          bias = Math.pow(2, exponentBits - 1) - 1;
          minExp = -bias + 1;
          maxExp = bias;
          minUnnormExp = minExp - precisionBits;
          status = isNaN(n = parseFloat(argument)) || n === -Infinity || n === +Infinity ? n : 0;
          exp = 0;
          len = 2 * bias + 1 + precisionBits + 3;
          bin = new Array(len);
          signal = (n = status !== 0 ? 0 : n) < 0;
          n = Math.abs(n);
          intPart = Math.floor(n);
          floatPart = n - intPart;

          for (k = len; k;) {
            bin[--k] = 0;
          }
          for (k = bias + 2; intPart && k;) {
            bin[--k] = intPart % 2;
            intPart = Math.floor(intPart / 2);
          }
          for (k = bias + 1; floatPart > 0 && k; --floatPart) {
            (bin[++k] = ((floatPart *= 2) >= 1) - 0);
          }
          for (k = -1; ++k < len && !bin[k];) {}

          if (bin[(lastBit = precisionBits - 1 + (k = (exp = bias + 1 - k) >= minExp && exp <= maxExp ? k + 1 :
              bias + 1 - (exp = minExp - 1))) + 1]) {
            if (!(rounded = bin[lastBit])) {
              for (j = lastBit + 2; !rounded && j < len; rounded = bin[j++]) {}
            }
            for (j = lastBit + 1; rounded && --j >= 0;
              (bin[j] = !bin[j] - 0) && (rounded = 0)) {}
          }

          for (k = k - 2 < 0 ? -1 : k - 3; ++k < len && !bin[k];) {}

          if ((exp = bias + 1 - k) >= minExp && exp <= maxExp) {
            ++k;
          }
          else {
            if (exp < minExp) {
              if (exp !== bias + 1 - len && exp < minUnnormExp) { /*"encodeFloat::float underflow" */ }
              k = bias + 1 - (exp = minExp - 1);
            }
          }

          if (intPart || status !== 0) {
            exp = maxExp + 1;
            k = bias + 2;
            if (status === -Infinity) {
              signal = 1;
            }
            else if (isNaN(status)) {
              bin[k] = 1;
            }
          }

          n = Math.abs(exp + bias);
          tmpResult = '';

          for (j = exponentBits + 1; --j;) {
            tmpResult = (n % 2) + tmpResult;
            n = n >>= 1;
          }

          n = 0;
          j = 0;
          k = (tmpResult = (signal ? '1' : '0') + tmpResult + bin.slice(k, k + precisionBits)
              .join(''))
            .length;
          r = [];

          for (; k;) {
            n += (1 << j) * tmpResult.charAt(--k);
            if (j === 7) {
              r[r.length] = String.fromCharCode(n);
              n = 0;
            }
            j = (j + 1) % 8;
          }

          r[r.length] = n ? String.fromCharCode(n) : '';
          result += r.join('');
          argumentPointer++;
        }
        break;

      case 'x':
        // NUL byte
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type x: \'*\' ignored');
        }
        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(0);
        }
        break;

      case 'X':
        // Back up one byte
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type X: \'*\' ignored');
        }
        for (i = 0; i < quantifier; i++) {
          if (result.length === 0) {
            throw new Error('Warning: pack(): Type X:' + ' outside of string');
          }
          else {
            result = result.substring(0, result.length - 1);
          }
        }
        break;

      case '@':
        // NUL-fill to absolute position
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type X: \'*\' ignored');
        }
        if (quantifier > result.length) {
          extraNullCount = quantifier - result.length;
          for (i = 0; i < extraNullCount; i++) {
            result += String.fromCharCode(0);
          }
        }
        if (quantifier < result.length) {
          result = result.substring(0, quantifier);
        }
        break;

      default:
        throw new Error('Warning:  pack() Type ' + instruction + ': unknown format code');
    }
  }
  if (argumentPointer < arguments.length) {
    throw new Error('Warning: pack(): ' + (arguments.length - argumentPointer) + ' arguments unused');
  }

  return result;
}