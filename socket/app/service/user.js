'use strict';
const Service = require('egg').Service;

class MoeService extends Service {
  async find(uid) {
    const user = {
      id: 1,
    };
    return user;
  }
}

module.exports = MoeService;
