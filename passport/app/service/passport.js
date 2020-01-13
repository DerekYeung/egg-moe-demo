'use strict';
const Service = require('egg-moe/component').Service;

class MoeService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.User;
  }

  async registry() {
    const mobile = this.gp.mobile || '';
    const password = this.gp.password || '';

    if (!mobile) {
      return this.error('请输入手机号');
    }
    if (!this.ctx.helper.validate.isMobile(mobile)) {
      return this.error('请输入正确的手机号');
    }

    if (!password) {
      return this.error('请输入密码');
    }
    const user = await this.model.fetch(mobile, 'mobile');
    if (user && user.id > 0) {
      return this.error('该手机号已注册');
    }
    const data = {
      mobile,
      password,
    };
    const register = await this.model.register(data);
    if (register.hasError) {
      return this.error(register.Errors);
    }
    return this.checkUser(register, true);
  }

  async login() {

    const mobile = this.gp.mobile || '';
    const password = this.gp.password || '';

    if (!mobile) {
      return this.error('请输入手机号');
    }
    if (!this.ctx.helper.validate.isMobile(mobile)) {
      return this.error('请输入正确的手机号');
    }

    if (!password) {
      return this.error('请输入密码');
    }
    const user = await this.model.fetch(mobile, 'mobile');
    if (!user || user.not('exists')) {
      return this.error('帐户不存在');
    }
    return this.checkUser(user);
  }

  async checkUser(user = {}, checked = false) {
    const password = this.gp.password || '';
    const validate = user.validatePassword(password);
    const connect = this.gp.connect || {};
    if (!validate && !checked) {
      return this.error('密码错误');
    }
    const authResult = connect.authResult || {};
    const userInfo = connect.userInfo || {};
    if (userInfo.nickname) {
      connect.authResult.name = userInfo.nickname;
    }
    if (connect.id && authResult.openid) {
      const connection = await user.connect(connect, this.ctx.Client.appid);
      if (!connection || connection.hasError) {
        return this.error(connection.Errors);
      }
    }
    return this.getUserAccessToken(user);
  }

  getUserAccessToken(user = {}) {
    const accessToken = user.makeGeneralAccessToken();
    return {
      accessToken,
    };
  }

  get accessToken() {
    const ctx = this.ctx;
    const accessToken = ctx.gp.accessToken || ctx.session.accessToken || ctx.cookies.get('accessToken', {
      signed: false,
    }) || ctx.get('x-moe-access-token');
    return accessToken || '';
  }

  async isRegistered() {
    const mobile = this.gp.mobile || '';
    if (!this.ctx.helper.validate.isMobile(mobile)) {
      return this.error('请输入正确的手机号');
    }
    const user = await this.model.fetch(mobile, 'mobile');
    const registered = !!(user && user.id);
    return {
      registered,
    };
  }

  async getLoginedUser() {
    const accessToken = this.accessToken;
    if (accessToken) {
      return await this.model.getUserByGeneralAccessToken(accessToken);
    }
    return this.model.create(this.ctx.user);
  }

}

module.exports = MoeService;
