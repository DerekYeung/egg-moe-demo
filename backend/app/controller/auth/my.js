'use strict';

const Controller = require('egg-moe/component').Controller;

class MoeController extends Controller {

  async __construct() {
    this.service = this.ctx.service.Admin;
  }

  async identity_list() {
    const AdminList = this.ctx.AdminList;
    const Admin = this.ctx.Admin;
    const User = this.ctx.User;
    return {
      User,
      Admin,
      identityList: AdminList,
    };
  }

  async powers() {
    return [];
  }

  async menu_list() {
    return {
      menus: [],
    };
  }

}

module.exports = MoeController;
