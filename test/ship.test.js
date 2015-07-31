'use strict';
const supertest = require('supertest'),
      api = supertest('http://tocu-api-dev-tranduchieu.c9.io'),
      access_token = 'bh5tviqrcufbeqesfen7j9554qr77u0062up2enmtk7b7bfhol31';

let city = 'Tuyên Quang',
    district = 'Sơn Dương',
    weight = 700;
      
describe('Ship', function() {
  it('Tính phí ship', function(done) {
    api.get('/ship?city=' + city + '&district=' + district + '&weight=' + weight)
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) return done(err);
        done();
      });    
  })
})