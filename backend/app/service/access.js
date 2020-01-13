'use strict';
const Service = require('egg-moe/component').Service;

class MoeService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.AccessLog;
    this.condition = [ 'POST' ];
  }

  get status() {
    return this.ctx.status || 200;
  }

  get method() {
    return this.ctx.method || 'GET';
  }

  get header() {
    return this.ctx.header || [];
  }

  get ua() {
    return this.ctx.get('user-agent') || '';
  }

  async log() {
    const logs = [];
    if (this.condition.includes(this.method)) {
      const log = await this.logRequest();
      logs.push(log);
    }
    return logs;
  }

  async logRequest() {
    const log = this.model.create();
    log.name = 'access';
    log.url = this.ctx.url;
    log.uuid = this.ctx.uuid;
    log.method = this.method;
    log.status = this.status;
    log.load_time = this.ctx.getRunTime();
    log.detail = {
      ua: this.ua,
      gp: this.gp,
      header: this.header,
    };
    return log.save();
  }

}

module.exports = MoeService;
