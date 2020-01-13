'use strict';

const Router = require('egg-moe/component').Router;

module.exports = app => {
  const controller = app.io.controller;

  const APP = app.io.of('/app');
  const Passport = app.io.of('/passport');

  APP.route('login', async function() {
    const module = new controller.app(this);
    await module.login.apply(this, []);
  });

  Passport.route('quick/login/request', async function() {
    const module = new controller.passport(this);
    await module.quickLoginRequest.apply(this, []);
  });

  Passport.route('quick/login/scan', async function() {
    const module = new controller.passport(this);
    await module.quickLoginScan.apply(this, []);
  });

  Passport.route('quick/login/confirm', async function() {
    const module = new controller.passport(this);
    await module.quickLoginConfirm.apply(this, []);
  });

  Passport.route('quick/login/reject', async function() {
    const module = new controller.passport(this);
    await module.quickLoginReject();
  });

  Passport.route('quick/login/success', async function() {
    const module = new controller.passport(this);
    await module.quickLoginSuccess.apply(this, []);
  });

  const router = new Router(app);
  router.init();
};
