module.exports = function(params, attrs) {
  for (var i = 0; i < attrs.length; i++) {
    if (params[attrs[i]] === undefined || params[attrs[i]] === '') {
      params[attrs[i]] = null;
    }
  }

  return params;
};
