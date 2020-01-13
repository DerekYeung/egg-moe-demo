'use strict';

const Controller = require('egg-moe/component').Controller;

class HomeController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.Passport;
  }

  async login() {
    return this.service.accessLogin(this.gp);
  }

  async verify() {
    return this.service.verifyAccess(this.gp);
  }

}

module.exports = HomeController;
