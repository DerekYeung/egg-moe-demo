'use strict';

const Router = require('egg-moe/component').Router;

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const router = new Router(app);
  router.init();
};
