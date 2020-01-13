'use strict';

const Controller = require('egg-moe/component').Controller;

class MoeController extends Controller {

  async index() {
    return {
      message: 'request index ok',
    };
  }

  async primary() {
    return {
      message: 'request primary ok',
    };
  }

  async secondary() {
    return {
      message: 'request secondary ok',
    };
  }

}

module.exports = MoeController;
