'use strict';
const models = require('../models');
const redisHelper = require('../services/redisHelper');
const promise = require('bluebird');
const _ = require('underscore');

let timeToLive = 60 * 60 * 24 * 30;

export function getCartById(cartId) {
  return new promise((resolve, reject) => {
    redisHelper.get('cart-' + cartId)
      .then(cartArray => {
        if (!cartArray) return reject({
          code: 404,
          message: 'Cart not found'
        });
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
            console.log(err);
            return reject(err);
          });
      })
      .catch(() => {
        // Nếu cart không tồn tại thì tạo mới
        createCart(cartId, {
            lines: newLines
          })
          .then(result => {
            return resolve(result);
          })
          .catch(err => {
            return reject(err);
          });
      });
  });
}

export function createCart(cartId, params) {

  if (!params.shippingInfo) {
    params['shippingInfo'] = null;
  }

  if (!params.paymentMethod) {
    params['paymentMethod'] = null;
  }


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
      .then(cart => {
        let lines = cart.lines;
        if (lines) {
          for (let i = 0; i < lines.length; i++) {
            newLines = _.reject(newLines, function(item) {
              return item.id == lines[i].id;
            });
          }
          if (newLines.length > 0) {
            lines = lines.concat(newLines);
            console.log(lines);
            redisHelper.setex('cart-' + cartId, lines, timeToLive)
              .then(reply => {
                return resolve(lines);
              })
              .catch(err => {
                return reject(err);
              });
          }
          else {
            return reject({
              code: 304,
              status: 'Not modified',
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
          // Lưu lại vào Redis
          redisHelper.setex('cart-' + cartId, newArray, timeToLive)
            .then(() => {
              return resolve(newArray);
            })
            .catch(err => {
              return reject(err);
            });
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
                return resolve(err);
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
                return resolve(err);
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

export function updateProductsInCart(cartId) {
  return new promise((resolve, reject) => {
    let countModified = 0;
    // Get cart
    return getCartById(cartId)
      .then(cartArray => {
        return promise.map(cartArray, function(cart) {
            return models.Product.findById(cart.id)
              .then(product => {
                if (product) {
                  if (cart['status'] !== product.status || cart['price'] !== product.price || cart['salePrice'] !== product.salePrice) {
                    cart['status'] = product.status;
                    cart['price'] = product.price;
                    cart['salePrice'] = product.salePrice;

                    countModified = countModified + 1;
                  }

                  return cart;
                }
                else {
                  cart['status'] = 'deleted';
                  countModified = countModified + 1;
                  // Sau cùng sẽ xóa
                  process.nextTick(function() {
                    return deleteCartLine(cartId, cart.id)
                      .then(result => {
                        console.log(result);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  });
                  return cart;
                }
              })
              .catch(err => {
                return reject(err);
              });
          })
          .then(result => {
            if (countModified > 0) {
              // Update in redis
              redisHelper.setex('cart-' + cartId, result, timeToLive)
                .then(reply => {
                  return resolve({
                    code: 200,
                    status: 'OK',
                    data: result
                  });
                })
                .catch(err => {
                  return reject(err);
                });
            }
            else {
              return resolve({
                code: 304,
                status: 'Not Modified',
                data: cartArray
              });
            }
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });
}

export function updateShippingInfo(cartId, shippingInfo) {
  return new promise((resolve, reject) => {
    checkAndGetCart(cartId)
      .then(cartObj => {
        cartObj['shippingInfo'] = shippingInfo;
        // Lưu lại vào Redis
        redisHelper.setex('cart-' + cartId, cartObj, timeToLive)
          .then(() => {
            return resolve(cartObj);
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });
}

export function updatePaymentInfo(cartId, paymentInfo) {
  return new promise((resolve, reject) => {
    checkAndGetCart(cartId)
      .then(cartObj => {
        cartObj['paymentMethod'] = paymentInfo.paymentMethod;
        // Lưu lại vào Redis
        redisHelper.setex('cart-' + cartId, cartObj, timeToLive)
          .then(() => {
            return resolve(cartObj);
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });
}


export function updateCheckoutInfo(cartId, checkoutInfo) {
  return new promise((resolve, reject) => {
    checkAndGetCart(cartId)
      .then(cartObj => {
        if (checkoutInfo.shippingInfo) {
          cartObj['shippingInfo'] = checkoutInfo.shippingInfo;
        }
        
        if (checkoutInfo.paymentMethod) {
          cartObj['paymentMethod'] = checkoutInfo.paymentMethod;
        }
        
        // Lưu lại vào Redis
        redisHelper.setex('cart-' + cartId, cartObj, timeToLive)
          .then(() => {
            return resolve(cartObj);
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });
}
 