'use strict';
const supertest = require('supertest'),
  api = supertest('http://tocu-api-dev-tranduchieu.c9.io'),
  access_token = '7qd6323cvoi6lgfm61iiti6skm9k2cbfbfmqurjv2eceei1ih21m';

let filters = 'salePrice!%3Dnull;status%3D%3Davailable,status%3D%3Dsuspended;boxName%3D@Hàn';
let sort = '-createdAt%2CsalePrice';
let include = 'Box,Model';
let limit = 20;
describe('Product', function() {
  it('query product', function(done) {
    api.get('/product?filters=' + filters + '&sort=' + sort + '&include=' + include + '&limit=' + limit)
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) return done(err);
        done();
      });
  });
});
