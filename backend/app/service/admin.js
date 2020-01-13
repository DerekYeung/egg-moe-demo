'use strict';
const Service = require('egg-moe/component').Service;

class MoeService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.Admin;
    this.admins = [];
  }

  get adminid() {
    return this.ctx.session.adminid || this.ctx.cookies.get('adminid', {
      signed: false,
    }) || this.ctx.get('x-moe-adminid') || 0;
  }

  get admin() {
    return this.getUsingAdmin();
  }

  async login() {
    if (this.ctx.User && this.ctx.User.is('exists')) {
      return this.error('用户已登录');
    }
    const username = this.ctx.gp.username || '';
    const password = this.ctx.gp.password || '';
    if (!username) {
      return this.error('请输入手机号');
    }
    if (!password) {
      return this.error('请输入密码');
    }
    if (!this.ctx.helper.validate.isMobile(username)) {
      return this.error('请输入正确的手机号');
    }

    const admins = await this.model.getAdminListByMobile(username);
    if (admins.not('exists')) {
      return this.error('管理员信息不存在');
    }

    const user = await admins.getAdminUser(username);

    if (user.not('exists')) {
      return this.error('帐号未注册');
    }

    if (!user.validatePassword(password)) {
      return this.error('密码不正确');
    }

    return this.ctx.service.Passport.login(user);
  }

  async getUserAdminList(user) {
    if (this.admins && this.admins.length > 0) {
      return this.admins;
    }
    if (!user || user.not('exists')) {
      return this.model.create([]);
    }
    const mobile = user.mobile;
    const admins = await this.model.getAdminListByMobile(mobile);
    this.admins = admins || this.model.create([]);
    return this.admins;
  }

  async getUsingAdmin() {
    const adminid = this.adminid;
    const admin = this.admins.length == 1 ? this.admins.first : this.admins.find(data => {
      return data.id == adminid;
    });
    return this.model.create(admin);
  }

  async getUserAdminIdentity(user) {
    const adminList = await this.getUserAdminList(user);
    const admin = await this.getUsingAdmin();
    return {
      admin,
      adminList,
    };
  }

  async getAdminPowers() {
    const admin = this.ctx.Admin;
    if (admin.admin) {
      return {
        menus: this.ctx.Menus,
        behaviors: this.ctx.Behaviors,
      };
    }
    await this.app.redis.del(`master/admin/menus/${admin.id}`);
    await this.app.redis.del(`master/admin/behaviors/${admin.id}`);
    const menus = await admin.getAdminMenus();
    const behaviors = await admin.getAdminBehaviors();
    return {
      menus,
      behaviors,
    };
  }

}

module.exports = MoeService;
