'use strict';

module.exports = app => {
  return async function(ctx, next) {
    return await next();
  };
};
