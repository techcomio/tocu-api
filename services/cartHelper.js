'use strict';
const redisHelper = require('../services/redisHelper');
const promise = require('bluebird');
const _ = require('underscore');

let timeToLive = 60 * 60 * 24 * 30;

export function getCartById(cartId) {
  return new promise((resolve, reject) => {
    redisHelper.get('cart-' + cartId)
      .then(cartArray => {
        return resolve(cartArray);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

export function pushOrCreateCart(cartId, newLines) {
  return new promise((resolve, reject) => {

    checkAndGetCart(cartId)
      .then(cartArray => {
        pushNewCartLines(cartId, newLines)
          .then((result) => {
            return resolve(result);
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(() => {
        // Nếu cart không tồn tại thì tạo mới
        createCart(cartId, newLines)
          .then(result => {
            return resolve(result);
          })
          .catch(err => {
            return reject(err);
          })
      })
  })
}

export function createCart(cartId, params) {
  return new promise((resolve, reject) => {
    redisHelper.setex('cart-' + cartId, params, timeToLive)
      .then(reply => {
        return resolve({
          cartId: cartId
        });
      })
      .catch(err => {
        return reject(err);
      });
  });
}

export function pushNewCartLines(cartId, newLines) {
  return new promise((resolve, reject) => {
    // Get
    redisHelper.get('cart-' + cartId)
      .then(cartArray => {
        if (cartArray) {

          for (let i = 0; i < cartArray.length; i++) {
            newLines = _.reject(newLines, function(item) {
              return item.id == cartArray[i].id;
            });
          }
          console.log(newLines);
          if (newLines.length > 0) {
            cartArray = cartArray.concat(newLines);
            console.log(cartArray);
            redisHelper.setex('cart-' + cartId, cartArray, timeToLive)
              .then(reply => {
                return resolve(cartArray);
              })
              .catch(err => {
                return reject(err);
              });
          }
          else {
            return reject({
              message: 'Sản phẩm đã có trong giỏ hàng'
            });
          }

        }
        else {
          return reject({
            message: 'Cart ID không tồn tại'
          });
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
}

export function deleteCartLine(cartId, productId) {
  return new promise((resolve, reject) => {
    redisHelper.get('cart-' + cartId)
      .then(cartArray => {
        if (cartArray) {
          let newArray = _.reject(cartArray, function(obj) {
            return obj['id'] == productId;
          });

          return resolve(newArray);
        }
        else {
          return reject({
            message: 'Cart ID không tồn tại'
          });
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
}

export function checkAndGetCart(cartId) {
  return new promise((resolve, reject) => {
    if (!cartId) return reject({
      message: 'No cartId'
    });

    redisHelper.get('cart-' + cartId)
      .then(cartArray => {
        if (!cartArray) return reject({
          message: 'Cart is null'
        });
        return resolve(cartArray);
      })
  });
}


export function mergeCartWhenLogin(guestCartId, userCartId) {
  return new promise((resolve, reject) => {

    checkAndGetCart(guestCartId)
      .then(guestCart => {
        // Check user cart
        checkAndGetCart(userCartId)
          .then(userCart => {
            // Merge carts
            pushNewCartLines(userCartId, guestCart)
              .then(() => {
                return resolve({
                  cartId: userCartId
                });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            // Nếu userCart không tồn tại thì rename guestCart
            return redisHelper.rename('cart-' + guestCartId, 'cart-' + userCartId)
              .then(reply => {
                return resolve({
                  cartId: userCartId
                });
              })
              .catch(err => {
                console.log(err);
              });
          });
      })
      .catch(() => {
        // guestCart không tồn tại
        // Trả về userCartId
        return resolve({
          cartId: userCartId
        });
      });
  });
}