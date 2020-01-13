'use strict';

const Controller = require('egg-moe/component').Controller.UnAuth;

class MoeController extends Controller {

  async __construct() {
    this.service = this.ctx.service.Deploy;
  }

  async info() {
    return {
      info: {
        env: process.env,
        platform: process.platform,
        config: process.config,
      },
    };
  }

  async service_list() {
    return this.service.getServiceList();
  }

  async test() {
    return {
      isDeployer: true,
    };
  }

}

module.exports = MoeController;
