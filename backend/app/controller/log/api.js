'use strict';

const Controller = require('egg-moe/component').Controller;

class MoeController extends Controller {

  async __construct() {
    this.service = this.ctx.service.LogApi;
    this.api = await this.service.get();
    return this.service.init();
  }

  async query() {
    return this.service.queryDetail();
  }

}

module.exports = MoeController;
