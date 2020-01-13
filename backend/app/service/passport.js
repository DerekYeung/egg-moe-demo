'use strict';
const Service = require('egg-moe/component').Service;

class MoeService extends Service {

  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.User;
  }

  get accessToken() {
    const ctx = this.ctx;
    const accessToken = ctx.gp.accessToken || ctx.session.accessToken || ctx.cookies.get('accessToken', {
      signed: false,
    }) || ctx.get('x-moe-access-token');
    return accessToken || '';
  }

  login(user) {
    const accessToken = user.makeGenerlAccessToken();
    if (!accessToken) {
      return this.error('签发授权令牌失败，请稍后重试');
    }
    this.ctx.login(user);
    return {
      accessToken,
    };
  }

  async getLoginedUser() {
    const accessToken = this.accessToken;
    if (accessToken) {
      return await this.model.getUserByGeneralAccessToken(accessToken);
    }
    return this.model.create(this.ctx.user);
  }

  async accessLogin() {
    const user = this.ctx.User;
    return {
      user,
    };
  }

}

module.exports = MoeService;
