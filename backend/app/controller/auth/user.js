'use strict';

const Controller = require('egg-moe/component').Controller.UnAuth;

class MoeController extends Controller {

  async __construct() {
    this.service = this.ctx.service.Master.Admin;
  }

  async index() {
    return {
      // test: this.service.test
    };
  }

  async in() {
    if (this.ctx.isPost) {
      return await this.service.login();
    }
    // this.ctx.login(user);
    return {};
    // this.ctx.logout();
  }

  async out() {
    this.ctx.logout();
  }

  async access() {
    return this.service.access();
  }

}

module.exports = MoeController;
