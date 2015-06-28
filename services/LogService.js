function makeLog(req, model, modeId, data, err) {
  var log = {

    userId: req.session.id,
    userName: req.session.userName,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    action: req.action,
    url: req.url,
    params: req.params,
    queru: req.query,

    model: model,
    modelId: modelId,

    err: err,

    dataBefore: data,
  };
  return log;
}

exports.write = function(req, model, modelId, data, err) {
  var log = makeLog(req, model, modelId, data, err);
  Log.create(log).exec(function(err, log){
    if(err){
      return;
    }
  });
};
