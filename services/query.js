exports.getMany = function(options) {

    return function(req, res) {
        var $wrap = wrap({
            page: req.query.page,
            perPage: req.query.perPage
        });

        var collectionName = options.collectionName;
        var searchField = options.searchField;

        if (!searchField) {
            searchField = [];
        }

        var _name, _value;
        var find = {};
        for (var i in req.query) {
            key = /search_(.*)/.exec(i);
            if (key) {
                _name = key[1];
                _value = req.query[i];
                find[_name] = _value;
            }
        }

        if (!(searchField instanceof Array)) {
            searchField = [searchField];
        }

        searchField.forEach(function(elem) {
            var _value = req.params[elem];
            if (_value) {
                find[elem] = _value;
            }

        });

        var Model = global[collectionName];
        if (!Model) {
            res.serverError();
            return;
        }

        var $query = $wrap.query;
        $query.where = find;
        var q = Model.find($query);


        q.done(function(err, docs) {
            if (err || docs === null || typeof docs === 'undefined' || docs.length === 0) {
                res.send(404, {
                    status: "Item not found"
                });
                return;
            }
            res.send(docs);
        });

    };
};


exports.getOne = function(options) {
    return function(req, res) {
        var searchField = options.searchField;
        var collectionName = options.collectionName;

        if (!searchField) {
            searchField = 'id';
        }

        var find = {};

        if (!(searchField instanceof Array)) {
            searchField = [searchField];
        }

        searchField.forEach(function(elem) {
            var _value = req.param(elem);
            find[elem] = _value;
        });

        var Model = global[collectionName];
        if (!Model) {
            res.serverError();
            return;
        }
        var q = Model.findOne(find);
        console.log(find);

        q.done(function(err, doc) {
            if (err || doc === null || typeof doc === 'undefined') {
                res.send(404, {
                    status: "Item Not Found"
                });
                return;
            }

            res.send(doc);
        });
    };
};


function wrap(options) {
    var page = options.page,
        perPage = options.perPage;
    if (!page) {
        page = 0;
    }
    perPage = perPage || consts.kDefaultItemsPerPage;
    return {
        query: {
            skip: page * perPage - 0,
            limit: perPage - 0
        }
    };
}
exports.wrap = wrap;
