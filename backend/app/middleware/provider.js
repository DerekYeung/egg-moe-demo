'use strict';

module.exports = app => {
  return async function(ctx, next) {
    const User = ctx.User;
    const AdminService = ctx.service.Admin;

    const AdminIdentity = await AdminService.getUserAdminIdentity(User);
    const Admin = AdminIdentity.admin;
    const AdminList = AdminIdentity.adminList;

    if ((User && User.is('exists')) && (!Admin || Admin.not('exists') || AdminList.not('exists'))) {
      if (ctx.m !== 'auth') {
        if (ctx.isApi) {
          ctx.body = {
            error: 1,
            event: 'identity-error',
          };
          return false;
        }
        return ctx.redirect('/switch.html?next=' + ctx.request.url);
      }
    }

    ctx.Admin = Admin;
    ctx.AdminList = AdminList;
    return await next();
  };
};
