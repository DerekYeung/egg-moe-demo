'use strict';

const Controller = require('egg-moe/component').Controller.UnAuth;

class MoeController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.service = this.app.service.Passport;
  }

  async index() {
    return this.service.logout();
  }

}

module.exports = MoeController;
