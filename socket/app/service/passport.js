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

  async getLoginedUser(accessToken = '') {
    if (accessToken) {
      return await this.model.getUserByGeneralAccessToken(accessToken);
    }
    return this.model.create(this.ctx.user);
  }

}

module.exports = MoeService;
