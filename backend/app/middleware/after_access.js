'use strict';

module.exports = app => {
  return async function(ctx, next) {
    const service = ctx.service.Access;
    await service.log();
  };
};
