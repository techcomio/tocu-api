'use strict';
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
exports.setex = function(token, data, timeToLive) {
	return new promise(function(resolve, reject) {
		if (token == null) throw new Error('Token is null');
		if (data != null && typeof data !== 'object') return reject('data is not an Object');

		var userData = data || {};
		userData._ts = new Date();

		if (timeToLive != null && typeof timeToLive !== 'number') return reject('TimeToLive is not a Number');


		redisClient.setex(token, timeToLive, JSON.stringify(userData), function(err, reply) {
			if (err) return reject(err);

			if (reply) {
				return resolve(true);
			}
			else {
				return reject('Token not set in redis');
			}
		});
	});
};

/*
 * Gets the associated data of the token.
 * token: String - token used as the key in redis
 * callback: Function - returns data
 */
exports.get = function(token) {
	return new promise(function(resolve, reject) {
		if (token == null) return reject('Data is null');

		redisClient.get(token, function(err, userData) {
			if (err) return reject(err);
			
			// if (!userData) reject('Not found');

			return resolve(JSON.parse(userData));
		});
	});
};

/*
 * Expires a token by deleting the entry in redis
 * callback(null, true) if successfuly deleted
 */
exports.del = function(token) {
	return new promise(function(resolve, reject) {
		if (token == null) return reject(new Error('Token is null'));

		redisClient.del(token, function(err, reply) {
			if (err) return reject(err);

			if (reply) return resolve(true);
			else return reject(new Error('Token not found'));
		});
	});
};


// Change key
exports.rename = function(oldKey, newKey) {
	return new promise(function (resolve, reject) {
		if (oldKey == null || newKey == null) return reject(new Error('Key is null'));
		redisClient.rename(oldKey, newKey, function(err, reply) {
			if (err) return reject(err);
			
			if (reply) return resolve(true);
		});
	});
};