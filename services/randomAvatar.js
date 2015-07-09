module.exports = function() {

  var url = [
    'http://api.tocu.vn/image/egg-avatars/egg1.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg2.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg3.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg4.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg5.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg6.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg7.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg8.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg9.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg10.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg11.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg12.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg13.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg14.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg15.jpg',
    'http://api.tocu.vn/image/egg-avatars/egg16.jpg'
  ];

  return url[getRandomInt(0, url.length - 1)];
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
