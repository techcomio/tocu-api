var redis = require('redis');
var redisClient = redis.createClient();
var promise = require('bluebird');

redisClient.on('error', function(err) {
	throw err;
});

exports.set = function(key, value) {
	return new promise(function(resolve, reject) {
		redisClient.set(key, JSON.stringify(value), function(err, reply) {
			if(err) return reject(err);
			return resolve(reply);
		})
	});
};


/*
 * Stores a token with user data for a ttl period of time
 * token: String - Token used as the key in redis 
 * data: Object - value stored with the token 
 * ttl: Number - Time to Live in seconds (default: 24Hours)
 * callback: Function
 */
exports.setTokenWithData = function(token, data, timeToLive) {
	return new promise(function(resolve, reject) {
		if (token == null) throw new Error('Token is null');
		if (data != null && typeof data !== 'object') throw new Error('data is not an Object');

		var userData = data || {};
		userData._ts = new Date();

		if (timeToLive != null && typeof timeToLive !== 'number') throw new Error('TimeToLive is not a Number');


		redisClient.setex(token, timeToLive, JSON.stringify(userData), function(err, reply) {
			if (err) return reject(err);

			if (reply) {
				return resolve(true);
			}
			else {
				return reject(new Error('Token not set in redis'));
			}
		});
	});
};

/*
 * Gets the associated data of the token.
 * token: String - token used as the key in redis
 * callback: Function - returns data
 */
exports.getDataByToken = function(token) {
	return new promise(function(resolve, reject) {
		if (token == null) reject(new Error('Token is null'));

		redisClient.get(token, function(err, userData) {
			if (err) return reject(err);

			if (userData != null) return resolve(JSON.parse(userData));
			else return reject(new Error('Token Not Found'));
		});
	});
};

/*
 * Expires a token by deleting the entry in redis
 * callback(null, true) if successfuly deleted
 */
exports.expireToken = function(token) {
	return new promise(function(resolve, reject) {
		if (token == null) return reject(new Error('Token is null'));

		redisClient.del(token, function(err, reply) {
			if (err) return reject(err);

			if (reply) return resolve(true);
			else return reject(new Error('Token not found'));
		});
	});
};