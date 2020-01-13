'use strict';

module.exports = app => {
  return async function(ctx, next) {
    const Passport = ctx.service.Passport;
    const user = await Passport.getLoginedUser();
    ctx.User = user;
    return await next();
  };
};
