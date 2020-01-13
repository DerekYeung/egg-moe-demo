'use strict';
const Service = require('egg-moe/component').Service;

class MoeService extends Service {

  constructor(ctx) {
    super(ctx);
    this.Access = this.app.model.AccessLog;
    this.model = this.ctx.model.AccessLog;
  }

  get accessid() {
    return this.ctx.gp.accessid || 0;
  }

  async init(must) {
    if (this.access == null) {
      this.access = await this.get();
    }
    const isEdit = must ? false : this.ctx.isEdit;
    if (!isEdit && (!this.access || this.access.not('exists'))) {
      return this.error('系统日志不存在');
    }
    if (this.access.is('unauthorized')) {
      return this.error('无权访问');
    }
  }

  async get(id) {
    let access;
    id = id || this.accessid;
    if (this.accessid > 0) {
      access = await this.model.fetch(id);
    } else {
      access = this.model.create();
    }
    this.access = access;
    return this.access;
  }

  async queryDetail() {
    const model = this.Access;
    return model.queryDetail(this.access.id);
  }


}

module.exports = MoeService;
