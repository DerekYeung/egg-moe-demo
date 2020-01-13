'use strict';

const Controller = require('egg-moe/component').Controller.UnAuth;
const Builder = require('egg-moe-builder');

class MoeController extends Controller {

  async __construct() {
    this.service = this.ctx.service.Upload;
  }

  async file() {
    return await this.service.file();
  }

}

module.exports = MoeController;
