'use strict';

const Controller = require('egg-moe/component').Controller.UnAuth;

class MoeController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.Passport;
  }

  async index() {
    return this.service.login();
  }

  async registry() {
    return this.service.registry();
  }

  async is_registered() {
    return this.service.isRegistered();
  }

}

module.exports = MoeController;
