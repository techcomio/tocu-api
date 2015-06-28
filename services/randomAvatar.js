module.exports = function() {

  var fileName = [
    '1405747102660_196.jpg',
    '1405747102698_197.jpg',
    '1405747102718_198.jpg',
    '1405747102738_199.jpg',
    '1405747102776_200.jpg',
    '1405747102790_201.jpg',
    '1405747102808_202.jpg',
    '1405747102832_203.jpg',
    '1405747102850_204.jpg',
    '1405747102869_205.jpg',
    '1405747102883_206.jpg',
    '1405747102896_207.jpg',
    '1405747102931_208.jpg',
    '1405747102954_209.jpg',
    '1405747102972_210.jpg',
    '1405747103006_211.jpg'
  ];

  return fileName[getRandomInt(0, fileName.length - 1)];
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
