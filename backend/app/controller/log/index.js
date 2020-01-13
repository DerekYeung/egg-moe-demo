'use strict';

const Controller = require('egg-moe/component').Controller;

class MoeController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.Log;
  }

  async index() {
    return {
    };
  }

  async sms_list() {
    return this.service.getSmsLogList();
  }

  async access_list() {
    return this.service.getAccessLogList(this.gp);
  }

  async api_list() {
    return this.service.getApiRequestLogList(this.gp);
  }

  async operation_list() {
    return this.service.getOperationLogList(this.gp);
  }

  async file_list() {
    return this.service.getFileLogList(this.gp);
  }

  async import_list() {
    return this.service.getImportList(this.gp);
  }

  async export_list() {
    return this.service.getExportList(this.gp);
  }

}

module.exports = MoeController;
