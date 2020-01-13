'use strict';

const Controller = require('egg-moe/component').Controller;

class MoeController extends Controller {

  async index() {
    const user = this.ctx.User || {};
    return {
      user,
    };
  }

}

module.exports = MoeController;
