'use strict';
const Service = require('egg-moe/component').Service;

class MoeService extends Service {

  constructor(ctx) {
    super(ctx);
    this.Operation = this.app.model.OperationLog;
    this.model = this.ctx.model.OperationLog;
  }

  get operationid() {
    return this.ctx.gp.operationid || 0;
  }

  async init(must) {
    if (this.operation == null) {
      this.operation = await this.get();
    }
    const isEdit = must ? false : this.ctx.isEdit;
    if (!isEdit && (!this.operation || this.operation.not('exists'))) {
      return this.error('操作日志不存在');
    }
    if (this.operation.is('unauthorized')) {
      return this.error('无权访问');
    }
  }

  async get(id) {
    let operation;
    id = id || this.operationid;
    if (this.operationid > 0) {
      operation = await this.model.fetch(id);
    } else {
      operation = this.model.create();
    }
    this.operation = operation;
    return this.operation;
  }

  async queryDetail() {
    const model = this.Operation;
    return model.queryDetail(this.operation.id);
  }


}

module.exports = MoeService;
